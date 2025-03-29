import struct
from bitarray import bitarray
import time
import random

def generate_id() -> str:
    """
    Generates a unique 24-character hexadecimal identifier by combining the current time 
    (as a 64-bit float) and a random 32-bit number.

    Returns:
        str: A 24-character hexadecimal string.
    """
    # Generate 64 bits of id using time
    current_time = time.time()
    bits_time = bitarray()
    bits_time.frombytes(struct.pack('>d', current_time))
    
    # Generate 32 bits if id using RNG
    random_number = random.getrandbits(32)
    bits_rng = bitarray(format(random_number, '032b'))
    
    bits = bits_time + bits_rng
    return bits.tobytes().hex().lower()
