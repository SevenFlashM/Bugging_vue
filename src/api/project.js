import request from "@/utils/otherRequest";

export function getInfo() {
    return request({
        url: "/project/info",
        method: "get"
    });
}