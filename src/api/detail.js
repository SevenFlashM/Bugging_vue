import request from '@/utils/otherRequest'
import axios from 'axios'
import qs from 'qs'

export function getDetailInfo() {
    return request({
        url: '/detail/info',
        method: 'get'
    })
}

export function getStatusInfo() {
    return request({
        url: '/detail/status',
        method: 'get'
    })
}

export function getPriorityInfo() {
    return request({
        url: '/detail/priority',
        method: 'get'
    })
}
export function getTypeInfo() {
    return request({
        url: '/detail/type',
        method: 'get'
    })
}

export function update(detail) {
    return axios({
        url: '/detail/update',
        method: 'put',
        baseURL: process.env.BASE_API,
        timeout: 5000,
        data: detail
    })
}
export function insert(detail) {
    return axios({
        url: '/detail/insert',
        method: 'post',
        baseURL: process.env.BASE_API,
        timeout: 5000,
        data: detail
    })
}
export function remove(ID) {
    return request({
        url: '/detail/delete',
        method: 'delete',
        params: { ID },
        // transformRequest: function (ID) {
        //     // 对 data 进行任意转换处理
        //     return qs.stringify(ID);
        // },
    })
}
