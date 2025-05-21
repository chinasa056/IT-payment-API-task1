exports.oddEven = (x, y) => {
    if (x % 2 === 0 && y % 2 === 0) {
        return `${x} and ${y} are both even`;
    } else if (x % 2 !== 0 && y % 2 !== 0) {
        return `${x} and ${y} are both odd`;
    } else {
        return 'One is odd and one is even';
    }
};