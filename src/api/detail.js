import request from '@/utils/otherRequest'
import axios from 'axios'
import qs from 'qs'

export const all = "/Problem/All";
export const handling = "/Problem/Handling";
export const belong = "/Problem/BelongToMe";
export const create = "/Problem/Create";
export const trace = "/Problem/Trace";
export const unclose = "/Problem/UnClose";

//获取全部问题信息
export function getDetailInfo() {
    return request({
        url: '/detail/info',
        method: 'get'
    })
}

//待我解决
export function getMyHandlingInfo(belongto) {
    return request({
        url: '/detail/handling',
        method: 'post',
        data: { belongto },
    })
}
//我创建的
export function getMyCreateInfo(creator) {
    return request({
        url: '/detail/create',
        method: 'post',
        data: { creator },
    })
}

//属于我的
export function getBelongtoMeInfo(belongto) {
    return request({
        url: '/detail/belong',
        method: 'post',
        data: { belongto },
    })
}
//我跟踪的
export function getMyTraceInfo(creator,belongto) {
    return request({
        url: '/detail/trace',
        method: 'post',
        data: { creator,belongto },
    })
}

//未关闭的
export function getAllUnclosedInfo() {
    return request({
        url: '/detail/unclose',
        method: 'post',
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

export function getMyCreate() {
    return request({
        url: '/detail/mycreate',
        method: 'delete',
    })
}

