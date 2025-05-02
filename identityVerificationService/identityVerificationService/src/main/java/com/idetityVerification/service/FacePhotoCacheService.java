package com.idetityVerification.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class FacePhotoCacheService {

    private final RedisTemplate<String, byte[]> redis;

    public FacePhotoCacheService(RedisTemplate<String, byte[]> redis) {
        this.redis = redis;
    }

    public void save(String userId, byte[] png) {
        redis.opsForValue().set("face:" + userId, png);
    }

    public byte[] get(String userId) {
        return redis.opsForValue().get("face:" + userId);
    }
}
