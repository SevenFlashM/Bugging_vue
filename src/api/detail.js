import request from '@/utils/otherRequest'

export function getDetailInfo() {
    return request({
        url: '/detail/info',
        method: 'post'
    })
}

export function getStatusInfo() {
    return request({
        url: '/detail/status',
        method: 'post'
    })
}

export function getPriorityInfo() {
    return request({
        url: '/detail/priority',
        method: 'post'
    })
}
export function getTypeInfo() {
    return request({
        url: '/detail/type',
        method: 'post'
    })
}

export function update() {
    return request({
        url: '/detail/update',
        method: 'post'
    })
}
export function insert() {
    return request({
        url: '/detail/insert',
        method: 'post'
    })
}
export function remove () {
    return request({
        url: '/detail/delete',
        method: 'post'
    })
}
