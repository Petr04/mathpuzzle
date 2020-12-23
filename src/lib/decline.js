const declensions = [
    [
        (noun, end='ы') => noun.slice(0, -1) + end,
        noun => noun.slice(0, -1),
    ],
    [
        noun => noun + 'а',
        noun => noun + 'ов',
    ],
    [
        noun => noun.slice(0, -1) + 'и',
        noun => noun.slice(0, -1) + 'ей',
    ],
];

const declensionsSpecial = {
    ['попытка']:
        {1: 'попыток'},
};

function decline(noun, declensionParam, number, end='ы') {
    const n = number % 10;
    if (n == 1) return noun;

    let nIndex;
    if (1 < n && n < 5)
        nIndex = 0;
    else
        nIndex = 1;

    if (noun in declensionsSpecial)
        if (nIndex in declensionsSpecial[noun])
            return declensionsSpecial[noun][nIndex];

    const declension = declensions[Math.abs(declensionParam)-1];
    return declension[nIndex](noun, end);
}

export default decline;
