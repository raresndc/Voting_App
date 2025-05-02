package com.documentsvc.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class IdPhotoCacheService {
    private final RedisTemplate<String, byte[]> redis;

    public IdPhotoCacheService(RedisTemplate<String, byte[]> redis) {
        this.redis = redis;
    }

    public void savePhoto(String idKey, byte[] pngData) {
        // set 24h TTL, for example
        redis.opsForValue()
                .set("idPhoto:" + idKey, pngData, 24, TimeUnit.HOURS);
    }

    public byte[] getPhoto(String idKey) {
        return redis.opsForValue().get("idPhoto:" + idKey);
    }
}