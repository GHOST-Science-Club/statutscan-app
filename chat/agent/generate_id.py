import struct
from bitarray import bitarray
import time
import random


def generate_id() -> str:
        float_value = time.time()
        packed = struct.pack('>d', float_value)
        bits = bitarray()
        bits.frombytes(packed)
        int_value = int(bits.to01(), 2)

        alphabet = "0123456789abcdefghiklmnopqrstvxyzABCDEFGHIKLMNOPQRSTVXYZ"
        encoded = []
        while int_value > 0:
            remainder = int_value % 56
            encoded.append(alphabet[remainder])
            int_value //= 56

        encoded.extend(random.sample(
            list(alphabet),
            max(0, 16-len(encoded))
        ))

        return ''.join(reversed(encoded))
