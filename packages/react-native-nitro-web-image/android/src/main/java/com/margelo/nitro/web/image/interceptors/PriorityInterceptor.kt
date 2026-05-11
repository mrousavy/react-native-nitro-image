package com.margelo.nitro.web.image.interceptors

import coil3.Extras
import coil3.getExtra
import coil3.intercept.Interceptor
import coil3.request.ImageResult

val PriorityKey = Extras.Key(default = 1)

class PriorityInterceptor(private val gate: PriorityGate) : Interceptor {
    override suspend fun intercept(chain: Interceptor.Chain): ImageResult {
        val priority = chain.request.getExtra(PriorityKey)
        return gate.withPermit(priority) { chain.proceed() }
    }
}
