/** beforeEach and afterEach can handle asynchronous code in the same ways that tests can handle asynchronous code 
 * ? they can either take a done parameter or return  ===> promise.
**/
beforeEach(() => { console.log("Before") })

//TODO: expect basic
test("two plus two = four", () => {
    expect(2 + 2).toBe(4)
})
//TODO: Test for
test("looping to be > 0", () => {
    for (let i = 0; i <= 10; i++) {
        for (let j = i + 1; j <= 10; j++) {
            expect(i + j).not.toBe(0)
        }
    }
})
//TODO: dynamic NULL type test
test('null', () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
});
//TODO: float to be odd
test('adding floating point numbers', () => {
    const value = 0.1 + 0.2;
    //expect(value).toBe(0.3);           This won't work because of rounding error
    expect(value).toBeCloseTo(0.3); // This works.
});
//TODO: string match
test("string match 'Q' ", () => {
    expect("Quang").toMatch('Q')
})
//TODO: Array testing
const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'milk',
];
test('the shopping list has milk on it', () => {
    expect(shoppingList).toContain('milk');
    expect(new Set(shoppingList)).toContain('milk');
});
//TODO: Handle throw Error 
// function compileAndroidCode() {
//     throw new Error('you are using the wrong JDK!');
// }
// test('compiling android goes as expected', () => {
//     expect(() => compileAndroidCode()).toThrow();
//     expect(() => compileAndroidCode()).toThrow(Error);

//     expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
//     expect(() => compileAndroidCode()).toThrow(/JDK/);

//     expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/);
//     expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/);
// });

//! ===ASYNC HANDLE======================================================================

//TODO: Promises
//? ** Jest wait for that promise return reject or reslove. If reslove => pass, rejec => fail
// const fetchData = async () => {
//     return await fetch("https://viecoi.vn/dang-ky-nguoi-tim-viec.html")
// }
// test('basiclly promise fun ', async () => {
//     // return fetchData().then(data => {
//     //     expect(data).toBe('peanut butter');
//     // });
//     return await expect(fetchData()).rejects.toMatch('error')
// })

//TODO: Callbacks

//? **By default, Jest tests complete once they reach the end of their execution.
//**Instead of putting the test in a function with an empty argument, use a single argument called done.
//** Jest will wait until the done callback is called before finishing the test.
//? Nghĩa là các bài kiểm tra Jest sẽ hoàn tất khi chúng kết thúc quá trình thực thi. Giải pháp là sử dụng func done()
// test('the data is peanut butter', done => {
//     function callback(error, data) {
//         if (error) {
//             done(error);
//             return;
//         }
//         try {
//             expect(data).toBe('peanut butter');
//             done();
//         } catch (error) {
//             done(error);
//         }
//     }

//     // fetchData(callback);
// });

//TODO: Implements before

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll

beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));

test('', () => console.log('1 - test'));

describe('Scoped / Nested block', () => {
    beforeAll(() => console.log('2 - beforeAll'));
    afterAll(() => console.log('2 - afterAll'));
    beforeEach(() => console.log('2 - beforeEach'));
    afterEach(() => console.log('2 - afterEach'));

    test('', () => console.log('2 - test'));
});

//? Before each chạy khi mỗi test được gọi: ở ví dụ trên có 2 test describe và test => chạy 2 lần before each
//? Before all chạy 1 lần khi bắt đầu bất kì 1 scope, ở đây có 2 scope: 1 là beforeAll khai báo toàn cục, 2 là
//? before all khai báo trong 1 block func scope.

//? Lưu ý: nếu so sánh  beforeAll block scope và beforeEach ở globalscope thì
//!  => ƯU TIÊN beforeAll

