import request from '@/utils/otherRequest'

export function initStatistic(creator, belongto) {
    return request({
        url: '/overview/statistic',
        method: 'post',
        data: {
            creator,
            belongto,
        }
    })
}

export function initMyChart(creator, belongto) {
    return request({
        url: '/overview/mychart',
        method: 'post',
        data: {
            creator,
            belongto,
        }
    })
}

export function initAllChart(creator, belongto) {
    return request({
        url: '/overview/allchart',
        method: 'post',
        data: {
            creator,
            belongto,
        }
    })
}

//添加用户接口
export function addUser(userName) {
    return request({
        url: '/overview/adduser',
        method: 'post',
        data: {
            userName
        }
    })
}

//获取用户接口（显示咋用户窗口）
export function getUser() {
    return request({
        url: '/overview/getuser',
        method: 'get',
    })
}


// //获取历史记录接口
// export function getHistory()
// {
//     return request({
//         url: '/overview/gethistoty',
//         method: 'get',
//     })
// }