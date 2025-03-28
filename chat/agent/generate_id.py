import struct
from bitarray import bitarray
import time

import random

def generate_id() -> str:
    # Generate 64 bits of id using time
    current_time = time.time()
    bits_time = bitarray()
    bits_time.frombytes(struct.pack('>d', current_time))
    
    # Generate 32 bits if id using RNG
    random_number = random.getrandbits(32)
    bits_rng = bitarray(format(random_number, '032b'))
    
    bits = bits_time + bits_rng
    return bits.tobytes().hex().lower()
