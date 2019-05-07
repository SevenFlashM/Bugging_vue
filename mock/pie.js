import Mock from "mockjs";



export default
    Mock.mock('/overview/myCircle', 'post', {
        "array|5": [{
            value: "@integer(20,150)",
            name: "@cname"
        }]
    });
Mock.mock('/overview/allCircle', 'post', {
    "array|5": [{
        value: "@integer(20,150)",
        name: "@cname"
    }]
});

// let myCircle = [];
// let allCircle = [];

// for (let i = 0; i < 5; i++) {
//     myCircle.push(Mock.mock('http://myCircle.com', 'post', {
//         name: "@cname",
//         value: "@integer(20,150)"
//     }))
// };

// for (let i = 0; i < 5; i++) {
//     allCircle.push(Mock.mock('http://myCircle.com', 'post', {
//         name: "@cname",
//         value: "@integer(20,150)"
//     }))
// }
// export default { myCircle, allCircle }