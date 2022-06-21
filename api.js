const axios = require("axios");

/**
 * 获取评论列表
 *
 * @param pageNum
 * @param oid
 * @returns {Promise<AxiosResponse<any>>}
 */
const getCommentList = async (pageNum,oid) => {
    if (pageNum < 1){
        pageNum = 1;
    }
    const apiUrl = `https://api.bilibili.com/x/v2/reply?oid=${oid}&nohot=1&type=1&pn=${pageNum}`;
    const res = await axios.get(apiUrl);
    if (res?.data?.data){
        const  data = res.data.data;
        const {replies,page} = data;
        return {
            dataList: replies,
            total: page.count,
        }
    }else {
        return null;
    }
}

module.exports = {
    getCommentList
}