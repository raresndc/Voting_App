package com.auth.service;

import com.auth.model.Product;
import com.auth.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    // getting all the products

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // get product by id

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // save/update product

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // delete product

    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }
}
