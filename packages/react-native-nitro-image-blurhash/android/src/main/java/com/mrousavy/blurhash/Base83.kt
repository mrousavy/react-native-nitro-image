package com.mrousavy.blurhash

internal object Base83 {

    private const val DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#\$%*+,-.:;=?@[]^_{|}~"

    fun encode83(value: Int, length: Int, buffer: CharArray, offset: Int) {
        var exp = 1
        var i = 1
        while (i <= length) {
            val digit = (value / exp % 83)
            buffer[offset + length - i] = DIGITS[digit]
            i++
            exp *= 83
        }
    }

    fun decode83(str: String, from: Int = 0, to: Int = str.length): Int {
        var result = 0
        for (i in from until to) {
            val index = DIGITS.indexOf(str[i])
            if (index != -1) {
                result = result * 83 + index
            }
        }
        return result
    }

}