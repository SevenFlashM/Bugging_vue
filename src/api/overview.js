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