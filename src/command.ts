#!/usr/bin/env node
const { Command } = require('commander')
const pkginfo = require('pkginfo')
const program = new Command()

program.version(pkginfo.version, '-v, --version', '@calmer/terminal-cli 当前版本')

// ⭐ 声明主命令相关选项
program
  // .description('命令描述') // 命令描述
  .option('-d, --dir <dirname>', '带参选项描述', '选项默认值') // 带参选项（选项全称 取值时转成驼峰写法），支持设置默认值
  .option('-c, --copy', '布尔选项描述') // 布尔选项（区别于 选项全称后有没有 <xxx>），指令中-c，选项copy属性值为true
  .option('-rm, --remove <dirname...>', '带参选项描述') // 数组参数必填，指令中多个参数空格分割，不支持设置默认值
  .option('-i, --ip [dirname...]', '带参选项描述') // 数组参数，非必填(不填值为true)，指令中多个参数空格分割，不支持设置默认值
  .action(async (options: object) => {
    console.log('action', options) // option.dir   option.copy
  })

// ⭐ 声明子命令
program
  .command('gen')
  .description('子命令描述') // 命令描述
  .option('-e, --ele <ddd>', '布尔选项描述') // 选项不能和主命令选项重名，否则为空
  .argument('<argument1Name>', '参数1描述') // 参数，必填
  .argument('<argument2Name>', '参数2描述') // 参数，必填
  /*
        argument 与 option 共存时：参数1为argument，参数2为option；否则参数1是argument或option
        添加多个argument时，依次为action的参数1、参数2、参数3
    */
  .action(async (argument1Name: string, argument2Name: string, options: object) => {
    console.log('action', argument1Name, argument2Name, options)
  })

// ⭐ 命令钩子
program
  .option('-t, --trace', 'display trace statements for commands')
  /*
        钩子
            preAction   action函数执行前（主+子命令）（thisCommand, actionCommand）
            postAction  action函数执行后（主+子命令）（thisCommand, actionCommand）
            preSubcommand   action命令解析前（子命令）（thisCommand, subcommand）
        参数
            thisCommand主命令，subCommand子命令、actionCommand 触发action的命令，对象API如下
                name()  命令名
                opts()  选项对象
                args    参数、选项的集合，按指令写入顺序以数组方式输出
    */
  .hook(
    'preSubcommand',
    (
      thisCommand: { opts: Function; name: Function },
      actionCommand: { name: Function; opts: Function; args: string[] }
    ) => {
      // 找选项
      console.log('thisCommand', thisCommand.name())
      console.log('actionCommand', actionCommand.name())
    }
  )

// ⭐ 自定义监听事件（目前只确定可以监听主命令 option）
program.on('option:dir', function (optionValue: any) {
  console.log('option:dir', optionValue)
})

// 解析用户执行命令传入的参数
program.parse(process.argv)

/*
    命令行输入option方式
    
    serve -d 80
    serve -d80
    serve --dir 80
    serve --dir=80
*/
