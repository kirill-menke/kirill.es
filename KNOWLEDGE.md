# Advantages of nginx/ caddy reverse proxy

    - More efficient on SSL termination than node (+ Smaller memory usage)
    - More efficent at static file serving
        - No JS overhead (less CPU intensive + doesn't have to go through JS event loop)
        - Disk-to-network transfer: Doesn't have to load file into memory first like node
    - Can handle thousands of requests concurrently (and potentially distribute to multiple node instances)
    - Connection pooling: Reuses HTTP connections to backend
