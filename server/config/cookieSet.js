// cookie设置
module.exports = {
    shot: {
        expires: new Date((new Date().getTime() + 3 * 24 * 360000)),
        path: '/',
        httpOnly: true,
        overWrite: true
    },
    long: {
        expires: new Date('2100/01/01'),
        path: '/',
        httpOnly: true,
        overWrite: true
    },
    over: {
        expires: new Date('2010/01/01'),
        path: '/',
        httpOnly: true,
        overWrite: true
    },
    hours: {
        expires: new Date((new Date().getTime() + 360000)),
        path: '/',
        httpOnly: true,
        overWrite: true
    }
};
