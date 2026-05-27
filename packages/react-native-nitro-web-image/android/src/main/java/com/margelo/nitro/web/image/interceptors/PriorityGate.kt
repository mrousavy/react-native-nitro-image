package com.margelo.nitro.web.image.interceptors

import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import java.util.PriorityQueue

class PriorityGate(private val maxConcurrentOperations: Int) {
    init { require(maxConcurrentOperations > 0) { "maxConcurrentOperations must be > 0" } }

    private val mutex = Mutex()
    private var currentlyRunningCount = 0
    private var nextArrivalSequenceNumber: Long = 0L
    private val pendingRequestsByPriority = PriorityQueue<PendingRequest>(
        compareByDescending<PendingRequest> { it.priority }.thenBy { it.arrivalSequenceNumber }
    )

    private class PendingRequest(
        val priority: Int,
        val arrivalSequenceNumber: Long,
        val permitGrantedSignal: CompletableDeferred<Unit>,
    )

    suspend fun <T> withPermit(priority: Int, operation: suspend () -> T): T {
        val permitGrantedSignal = CompletableDeferred<Unit>()
        var enqueuedRequest: PendingRequest? = null

        mutex.withLock {
            if (currentlyRunningCount < maxConcurrentOperations) {
                currentlyRunningCount++
                permitGrantedSignal.complete(Unit)
            } else {
                val request = PendingRequest(priority, nextArrivalSequenceNumber++, permitGrantedSignal)
                enqueuedRequest = request
                pendingRequestsByPriority.add(request)
            }
        }

        try {
            permitGrantedSignal.await()
        } catch (e: CancellationException) {
            withContext(NonCancellable) {
                val request = enqueuedRequest
                val wasStillQueued = request != null && mutex.withLock { pendingRequestsByPriority.remove(request) }
                if (!wasStillQueued) releasePermitAndPromoteNext()
            }
            throw e
        }

        try {
            return operation()
        } finally {
            withContext(NonCancellable) { releasePermitAndPromoteNext() }
        }
    }

    private suspend fun releasePermitAndPromoteNext() {
        mutex.withLock {
            while (true) {
                val nextRequest = pendingRequestsByPriority.poll()
                if (nextRequest == null) {
                    currentlyRunningCount--
                    return@withLock
                }
                if (nextRequest.permitGrantedSignal.complete(Unit)) return@withLock
            }
        }
    }
}
