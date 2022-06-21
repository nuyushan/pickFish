const {getCommentList} = require("./api");
const {oidCommentMap} = require("./commentSet");
const CronJob= require("cron").CronJob;

let job;

const createJob = (socket) => {
    if (job){
        return;
    }
    job = new CronJob(
        '0/10 * * * * *',
        async function(){
            const oidList = Object.keys(oidCommentMap);
            for (const oid of oidList) {
                const data = await getCommentList(1,oid);
                const commentSet = oidCommentMap[oid];
                //没发送过的数据列表
                const canSendDataList = [];
                if (!data){
                    continue;
                }
                console.log(data);
                for (const reply of data.dataList) {
                    //已经发送过了，不处理
                    if (!commentSet[reply.rpid]) {
                        canSendDataList.push(reply);
                        commentSet[reply.rpid] = reply;
                    }
                }
                socket.broadcast.emit('sendData',{
                    ...data,
                    oid,
                    dataList: canSendDataList
                });
            }
        },
        null,
        true,
        'America/Los_Angeles'
    );
    job.start()
}

module.exports = {
    createJob
}