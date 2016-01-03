"use strict";
/**
 * Created by lich on 2016-01-02.
 */
function strip_comments_hash(text){
    return text
        .split(/[\r\n]+/g)
        .map(x=>x.trim())
        .filter(x=>x.charAt(0) != '#')
        .filter(x=>x.length)
        .join('\n');
}

function parse_key_argument_string(str){
    let args = str.split(/[\"\']/g)
        .filter(x => x.length);
    let fixed_args = [];
    args.forEach((x,i) => {
       if(i%2){
           fixed_args.push(x);
       } else {
           let sec_args = x.split(' ').filter(x => x.length);
           fixed_args = fixed_args.concat(sec_args);
       }
    });
    return fixed_args;
}
function parse_keyarguments(text){
    let config = {};
    let lines = text.split(/[\r\n]+/g);
    let keys ={};
    lines
        .map(x => parse_key_argument_string(x))
        .forEach(x=>{
            let header = x.shift();
            if(!keys[header]){
                config[header] = x;
                keys[header] = 1;
            } else if (keys[header] == 1){
                keys[header]++;
                config[header] = [config[header], x];
            } else {
                keys[header]++;
                config[header].push(x);
            }
        });
    return config;
}

const comment_strippers = {
    "hash" : strip_comments_hash
};
const parsers = {
    "key_arguments" : parse_keyarguments
};
function parse(config, configtype, commenttype){
    let pureConfig = comment_strippers[commenttype](config);
    return parsers[configtype](pureConfig);
}
module.exports = parse;