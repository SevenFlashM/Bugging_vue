import request from "@/utils/otherRequest";

export function getInfo() {
    return request({
        url: "/project/info",
        method: "get"
    });
}

export function getProjectIDByName(projectName) {
    return request({
        url: "/project/getProjectIDByName",
        method: "get",
        params:{projectName},
    });
}