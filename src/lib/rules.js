import decline from '@/lib/decline';

export default {
    required: () =>
        s => Boolean(s) || 'Поле обязательно для заполнения',
    email: () =>
        s => !s || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(s)
            || 'Неправильный e-mail',
    minLength: min =>
        s => !s || (s.length > min)
            || `Введите от ${min} ${decline('символ', 2, min)}`,
    maxLength: max => // make range() ?
        s => !s || (s.length <= max)
            || `Вы превысили максимальную длину на
                ${s.length - max} ${decline('символ', 2, s.length - max)}`,
};
