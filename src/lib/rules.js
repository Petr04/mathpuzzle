import decline from '@/lib/decline';

export default {
    required: () =>
        s => Boolean(s) || 'Поле обязательно для заполнения',
    maxLength: (max =>
        function (s) {
            if (!s) return true;

            return (s.length <= max)
                || `Вы превысили максимальную длину на
                ${s.length - max} ${decline('символ', 2, s.length - max)}`;
        }),
};
