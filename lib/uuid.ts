import 'react-native-get-random-values';

export const uuid = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return [...bytes]
        .map((b, i) =>
            [4, 6, 8, 10].includes(i)
                ? '-' + b.toString(16).padStart(2, '0')
                : b.toString(16).padStart(2, '0')
        )
        .join('');
};
