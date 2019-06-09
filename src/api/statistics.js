import request from "@/utils/otherRequest"

export function getStatusDataList()
{
    return request({
        url: '/statistics/statuslist',
        method:"get",
    })
}

export function getTypeDataList()
{
    return request({
        url: '/statistics/typelist',
        method:"get",
    })
}

export function getPriorityDataList()
{
    return request({
        url: '/statistics/prioritylist',
        method:"get",
    })
}