const {spawn}=require("node:child_process"); const path=require("node:path");
const root=path.resolve(__dirname,".."), mg=path.join(root,"SLManagement-main"), reg=path.join(root,"FCFPSL-main");
const env={...process.env,PORT:"5000",NODE_ENV:"production"};
if(!env.SESSION_SECRET){console.error("SESSION_SECRET must be configured.");process.exit(1);}
const flask=spawn("python",["-m","gunicorn","--bind","127.0.0.1:5001","app:app"],{cwd:mg,env:{...env,PORT:"5001"},stdio:"inherit"});
const node=spawn("npm",["start"],{cwd:reg,env,stdio:"inherit"});
const stop=()=>{flask.kill("SIGTERM");node.kill("SIGTERM");}; process.on("SIGINT",stop);process.on("SIGTERM",stop);
flask.on("exit",c=>{if(c&&c!==0){node.kill();process.exit(c);}});node.on("exit",c=>{flask.kill();process.exit(c||0);});
