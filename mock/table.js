import Mock from "mockjs";

//自定义mock数据
var Random = Mock.Random;
Random.extend({
    status: function () {
        var statusDropdown = ["新建", "处理中", "已拒绝", "已验收", "已解决"];
        return this.pick(statusDropdown);
    },
    priority: function () {
        var priorityDropdown = ["致命", "严重", "一般", "轻微"];
        return this.pick(priorityDropdown);
    }
});

export default Mock.mock('/Problem/All', 'post', {
    "array|15-30": [{
        date: '@datetime("yyyy-MM-dd")',
        creater: "@cname",
        brief: "@csentence(10, 25)",
        status: "@status",
        priority: "@priority",
        belongto: Random.cname(2) + "-" + "@cname"
    }]
});

Mock.mock('/Problem/ToSolve', 'post', {
    "array|15-30": [{
        date: '@datetime("yyyy-MM-dd")',
        creater: "@cname",
        brief: "@csentence(10, 25)",
        status: "@status",
        priority: "@priority",
        belongto: Random.cname(2) + "-" + "@cname"
    }]
});

Mock.mock('/Problem/Mine', 'post', {
    "array|15-30": [{
        date: '@datetime("yyyy-MM-dd")',
        creater: "@cname",
        brief: "@csentence(10, 25)",
        status: "@status",
        priority: "@priority",
        belongto: Random.cname(2) + "-" + "@cname"
    }]
});

Mock.mock('/Problem/Create', 'post', {
    "array|15-30": [{
        date: '@datetime("yyyy-MM-dd")',
        creater: "@cname",
        brief: "@csentence(10, 25)",
        status: "@status",
        priority: "@priority",
        belongto: Random.cname(2) + "-" + "@cname"
    }]
});

Mock.mock('/Problem/Distr', 'post', {
    "array|15-30": [{
        date: '@datetime("yyyy-MM-dd")',
        creater: "@cname",
        brief: "@csentence(10, 25)",
        status: "@status",
        priority: "@priority",
        belongto: Random.cname(2) + "-" + "@cname"
    }]
});

Mock.mock('/Problem/Unsolve', 'post', {
    "array|15-30": [{
        date: '@datetime("yyyy-MM-dd")',
        creater: "@cname",
        brief: "@csentence(10, 25)",
        status: "@status",
        priority: "@priority",
        belongto: Random.cname(2) + "-" + "@cname"
    }]
});