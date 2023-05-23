![Node CLI (1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8aa3632a57eb405496f364b4baf54eec~tplv-k3u1fbpfcp-watermark.image?)

## 一、什么是 CLI

CLI 全称是 Command Line Interface，是一类通过命令行交互的终端工具。Web 开发中，我们无时无刻都在使用 CLI 辅助开发，提升操作效率，比如 git、npm、webpack、vite 等

## 二、为什么需要 CLI

CLI 可以帮助我们更高效的操作计算机系统，工作中，我们可以我们将有规律可循的、重复的、繁琐的、模板化的工作，集成到 CLI 工具中。一个命令，即可快速的完成一些列操作

相比于 GUI 工具（用户图形界面）

- **GUI**：更侧重易用性，用户通过点击图形界面，完成相关
- **CLI**：更侧重操作效率，通过命令组合自动化操作、批量操作等

## 三、Node CLI 开发核心步骤

**前置说明**：略过 `npm init -y` 初始化项目等操作

### 3.1、定义命令文件

- 项目中定义 JS 命令文件，文件头部必须有 `#!/usr/bin/env node`

```
#!/usr/bin/env node

console.log('Hello Node CLI');
```

- 头部声明代码，是告诉系统使用 NodeJS 执行脚本；如不声明，默认按 shell 去解析执行

```
which env ---> /usr/bin/env
```

### 3.2、定义终端命令

- `package.json` 文件中，声明 `bin` 字段；格式为：`<command>: <JS file>`

```
{
    "bin": {
        "test-cli": "./bin/command.js"
    }
}
```

### 3.3、调试 CLI 工具

- Node CLI 或 依赖包，可通过软链接进行本地调试
- 创建软链接：在 CLI 根目录下执行 `npm link`，
- 调试 CLI：终端运行命令 `test-cli`，即可看到输出 `Hello Node CLI`

### 3.4、发布 CLI 工具

- 登录 npm：`npm login`
- 发布 CLI：`npm publish`

---

至此，你已经掌握了发布一款简单指令的 Node CLI，但这只是一个 DEMO，下面继续学习实操部分吧~

## 四、Node CLI 最佳实践

### 4.1、遵循 POSIX 参数

**[POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) 语法已被广泛接受为命令行工具的标准，我们开发命令行工具时，应该遵守它。** 常见规则举例如下：

- 可以指令帮助或示例中将选项参数或选项标记为方括号（ `[]` ）表示它们是可选的；或带有尖括号（ `<>` ）表示它们是必需的。
- 允许使用短格式的单个字母参数作为长格式参数的别名（请参阅 [GNU 编码标准](https://www.gnu.org/prep/standards/html_node/Command_002dLine-Interfaces.html)）
- 使用缩写形式单数指定的选项 - 可以包含一个字母数字字符。
- 指定多个没有值的选项可以进行分组，例如 `myCli -abc` 等效于 `myCli -a -b -c`

命令行高级用户希望您的命令行应用程序具有与其他 Unix 应用程序类似的约定

### 4.2、遵循 [Semver](https://semver.org/) 版本

**版本格式**  `X.Y.Z-[state]`

- `X` 代表 主版本号：功能新增、移除，API 不向下兼容
- `Y` 代表 次版本号：功能新增，API 向下兼容
- `Z` 代表 修订版本号：问题修复，API 向下兼容
- `[state] `状态解释如下

| 描述方式 | 说明 | 含义 |
| --- | --- | --- |
| alpha | alpha 版 | 内测版本：bug 较多 |
| beta | beta 版 | 公测版本：存在 bug，有缺陷 |
| gamma | Gamma 版 | 相当成熟的测试版：与发行版相差无几（一般略过此版本） |
| rc | Release Candidate | 发行倒计时版本：实现了全部功能，修复了大部分 bug，接近发布倒计时，有时会进一步细分为 `rc.1`、`rc.2` |

### 4.3、提供丰富且友好的交互

- 提供丰富的交互，如 select 选择、filter 筛选、帮助提示等，让人操作更便捷

![](https://raw.githubusercontent.com/enquirer/enquirer/master/media/survey-prompt.gif)

- 提供富有色彩的体验，让人心旷身体

  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/625e3fefb6eb4b9a99a1d0f81a64f12f~tplv-k3u1fbpfcp-zoom-1.image)

- 提供多样的 loading，让人减少等待烦恼

## 五、Node CLI 生态库（详细用法）

### 5.1、注册解析命令 [commander](https://github.com/tj/commander.js)

**描述**：commander 提供了完整的 Node 命令行解决方案，可以更便捷的进行命令注册及解析

**demo 版本**：9.4.1

**demo 01**：注册主命令 及 相关选项

```
#!/usr/bin/env node
const { Command } = require('commander')
const pkginfo = require('pkginfo')
const program = new Command()

program.version(pkginfo.version, '-v, --version', '@calmer/terminal-cli 当前版本')

// ⭐ 注册主命令相关选项
program
  // .description('命令描述') // 命令描述
  .option('-d, --dir <dirname>', '带参选项描述', '选项默认值') // 带参选项（选项全称 取值时转成驼峰写法），支持设置默认值
  .option('-c, --copy', '布尔选项描述') // 布尔选项（区别于 选项全称后有没有 <xxx>），指令中-c，选项copy属性值为true
  .option('-rm, --remove <dirname...>', '带参选项描述') // 数组参数必填，指令中多个参数空格分割，不支持设置默认值
  .option('-i, --ip [dirname...]', '带参选项描述') // 数组参数，非必填(不填值为true)，指令中多个参数空格分割，不支持设置默认值
  .action(async (options: object) => {
    console.log('action', options) // option.dir   option.copy
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
// 扩展：如下获取选项对象
program.opts();
```

**demo 02：注册子命令、参数、选项**

```
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
```

**demo 03：命令钩子**（主命令、子命令）

```
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
```

**demo 04：自定义监听事件**（目前只确定 可以监听主命令 option）

```
program.on('option:dir', function (optionValue: any) {
  console.log('option:dir', optionValue)
})
```

### 5.2、交互式命令工具 [inquirer](https://github.com/SBoudrias/Inquirer.js)

**介绍**：inquirer 是一个 命令行交互工具，提供多种表单选项，优化命令行交互

**demo 版本**：8.2.5

**demo 01：** 核心使用流程

- `validate`、`filter` 函数：返回 true 代表校验通过，返回具体内容作为错误输出 中止程序

```
import inquirer from 'inquirer';


/*
        type 	表单类型
  name	答案变量
  message	提示信息
  default	默认值
*/
inquirer.prompt({
  type: 'input' // 交互组件类型
  name: 'name' // 数据属性名称
  message: '用户名' // 交互提示
  default: '' // 默认值
  choices: '' // 当交互类型为`选择类型`时, 该属性配置可选项目

  // 校验函数, 函数以当前回答为参数。 返回: true 通过 false 不通过,无提示 Error 不通过,显示错误信息
  validate(value){
    return !value.length ? new Error('项目名称不能为空') : true
  }

  // 过滤器, 返回修改后的回答。优先级高于 `validte`
  filter(value){
     return /vue/.test(value) ? `${value}-demo` : value
  }

  // 转换器, 返回转换后的值，只作为显示，不影响收集结果
  transformer(value){
     return /vue/.test(value) ? `${value}-demo` : value
  },

  // 是否显示问题
  when(answers){
     return !!answers.company
  },

  // message 前缀
  prefix: '',

  // message 后缀
  suffix: '',

  // 如果回答已存在, 是否依然提问
  askAnswered: false,
}).then((answers) => {
        // answers.project
}).catch((error) => {
  console.error('出错啦！', error);
});


// 使用方式二
(async () => {
  const { project } = await inquirer.prompt({
    type: 'input',
    name: 'project',
    message: '项目名称',
    default: 'copyLeft',
  });

  console.log(project);
});
```

**demo 02**：`when` 提示列表中，决定是否下一步

```
inquirer.prompt([{
    type: "confirm",
    message: "是否发送 Kim 通知？",
    name: "confirm",
}, {
    type: "checkbox",
    message: "选择更新类型（可多选）:",
    name: "updateTypes",
    when: function (answers) { // 当confirm为true的时候才会提问当前问题
        return answers.confirm
    },
    choices: [
        "feat（新功能）",
        "fix（修补bug）",
        "docs（更新文档）",
        "style（代码格式优化：不影响代码运行的变动，注意这里指的不是css style）",
        "refactor（重构：即不是新增功能，也不是修改bug的代码变动）",
        "chore（构建优化，工具优化等）",
        "test（增加测试用例，测试代码等）",
        "revert（回滚提交）"
    ],
    validate: (answer) => {
        if (!answer.length) {
            return '请选择更新类型';
        }

        return true;
    },
}]);
```

**demo 03**：input 输入框

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a887fc30b6604871a631834e05715e6f~tplv-k3u1fbpfcp-zoom-1.image)

```
inquirer.prompt({
  type: 'input',
  name: 'name',
  message: '请输入',
  default: '默认输入的内容'
})
```

**demo 04**：input 数值输入框

- 特征：输入非数值不生效

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/757c1a6d26cc47b982249eef7236c23c~tplv-k3u1fbpfcp-zoom-1.image)

```
inquirer.prompt({
  type: 'number',
  name: 'age',
  message: '请输入',
  default: 111
})
```

**demo 05**：password 密码输入框

- 特征：输入的内容不在终端显示

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fe01aaf289d43759069ecfb7fd280e1~tplv-k3u1fbpfcp-zoom-1.image)

```
inquirer.prompt({
  type: 'password',
  name: 'password',
  message: '请输入',
  default: '密码'
})
```

**demo 06**：list 单选

- 特征：单选列表，没有序号，没有关键字搜索

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42885f3e116c4b9a853cd86ec5dd4098~tplv-k3u1fbpfcp-zoom-1.image)

```
inquirer.prompt({
  type: 'list',
  name: 'listAnswer',
  message: '单选',
  choices: [
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 }
  ]
})
```

**demo 07**：rawlist 列表

- 特征：可输入答案的列表，有序号，没有关键字搜索

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25f5ba43d0764376b3fbb54afc5f4f28~tplv-k3u1fbpfcp-zoom-1.image)

```
inquirer.prompt({
  type: 'rawlist',
  name: 'rawlistAnswer',
  message: '列表',
  choices: [
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 }
  ]
})
```

- **demo 08**：checkbox 多选

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/141f0af099114a69babbdbfa11ded4e6~tplv-k3u1fbpfcp-zoom-1.image)

```
inquirer.prompt({
  type: 'checkbox',
  name: 'checkboxAnswer',
  message: '多选',
  choices: [
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 }
  ]
})
```

**demo 09**：confirm 判断

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed77aae7719d40b1955bd8a3360a2f4c~tplv-k3u1fbpfcp-zoom-1.image)

```
inquirer.prompt({
  type: 'confirm',
  name: 'confirmAnswer',
  message: '判断',
})
```

**demo 10**：插件机制、autocomplete 需要单独引入

- 特征：支持过滤可选项

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12026773588640aeb8e9da5bc2b2b8ca~tplv-k3u1fbpfcp-zoom-1.image)

```
import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';

inquirer.registerPrompt('autocomplete', inquirerPrompt);

inquirer.prompt({
  // @ts-ignore
  type: 'autocomplete',
  name: 'component',
  message: '请选择要开发的组件',
        source: (answersSoFar, input) => {
    return [1, 2].filter(val => val.includes(input))
  },
}).then((answers) => {
  console.log('inquirer-answers', answers);
})
```

**demo 11：** Separator 分割线

- 特征：可选列表之间插入分割线

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d6bbc33fe2a249bb83c926ad854a9b6e~tplv-k3u1fbpfcp-zoom-1.image)

```
inquirer.prompt([
  {
    type: 'checkbox',
    name: '多选',
    message: 'checkbox',
    choices: [ "Choice A", new inquirer.Separator(), "choice B" ]
  }
])
```

### 5.3、命令行提示图标 [Ora](https://github.com/sindresorhus/ora)

场景：命令行提示图标或小动画

**demo 版本**：0.6.0

![Kapture 2022-12-18 at 21.04.57.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d44eb9da4554b0dbf619ce8c7d2752e~tplv-k3u1fbpfcp-watermark.image?)

```
import ora from 'ora';

const spinner = ora({
  text: "链接网络中"
}).start(); // 开始状态 => 加载状态

setTimeout(() => {
  spinner.color = "yellow";
  spinner.text = "网速有点慢";
}, 1000); // 还是 加载状态, 更新文案和颜色

setTimeout(() => {
  spinner.succeed("下载成功"); // 加载状态 => 成功状态
}, 2000);
```

```
import ora from 'ora'

const spinerList = [ // 挑了几个更加图形化的模式
    'timeTravel',
    'speaker',
    'soccerHeader',
    'fistBump',
    'weather',
    'moon',
    'earth',
    'smiley'
]
let index = 0

const spinner = ora({
    prefixText: 'spinnerName：‘timeTravel’',
    spinner: 'timeTravel'
}).start()

setInterval(function () {
    spinner.prefixText = `spinnerName: timeTravel`
    spinner.spinner = spinerList[index]
    index = ++index % spinerList.length;
}, 1500)
```

**cli-spinners 是 ora 的核心库：** 如果场景不复杂，可以使用它。

```
const Spinner = require('cli-spinner').Spinner;
const spinner = new Spinner('loading.. %s');
spinner.setSpinnerString('|/-\');

spinner.start()

setTimeout(() => {
    spinner.stop()
}, 3000);
```

### 5.4、命令行字符颜色 [chalk](https://github.com/chalk/chalk)

- 场景：终端打印输出各种样式的字符（颜色、背景色、下划线等）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa128efdfd73484f8d57049e54ff26d3~tplv-k3u1fbpfcp-zoom-1.image)

```
import chalk from 'chalk';

console.log(chalk.blue('Hello world!'));
console.log(chalk.blue.bgRed.bold('Hello world!'));
```

### 5.5、命令行进度条 [progress](https://github.com/visionmedia/node-progress)

场景：终端展示进度条

```
var ProgressBar = require('progress');

var bar = new ProgressBar(':bar', { total: 10 });
var timer = setInterval(function () {
  bar.tick();
  if (bar.complete) {
    console.log('\ncomplete\n');
    clearInterval(timer);
  }
}, 100);
```

### 5.6、命令行可视化组件 [blessed-contrib](https://github.com/yaronn/blessed-contrib)

场景如下图

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bc33c344db6491e817a8f78c9107475~tplv-k3u1fbpfcp-zoom-1.image)

### 5.7、终端持久化存储 configstore、conf

场景：需要为 CLI 应用程序提供存储持久性，多次调用 CLI 命令时，记录用户之前选择，提升用户体验

[configstore](https://www.npmjs.com/package/configstore) 库

```
import Configstore from 'configstore';


const config = new Configstore('name', {foo: 'bar'});
console.log(config.get('foo'));
//=> 'bar'

config.set('awesome', true);
console.log(config.get('awesome'));
//=> true

// Use dot-notation to access nested properties.
config.set('bar.baz', true);
console.log(config.get('bar'));
//=> {baz: true}

config.delete('awesome');
console.log(config.get('awesome'));
//=> undefined
```

[conf](https://www.npmjs.com/package/conf) 库

```
const Conf = require('conf');

const config = new Conf();

config.set('unicorn', '🦄');
console.log(config.get('unicorn'));
//=> '🦄'

// Use dot-notation to access nested properties
config.set('foo.bar', true);
console.log(config.get('foo'));
//=> {bar: true}

config.delete('unicorn');
console.log(config.get('unicorn'));
//=> undefined
```

### 5.8、JS 中执行 Shell 脚本

#### 方案一：Node 子进程 child_process

**Node 子进程** `require('child_process')` **有 7 个函数 可以执行 shell 语句、文件：**

**4 个异步函数：** `spawn`、`fork`、`exec`、`execFile`

**3 个同步函数**：`spawnSync`、`execSync`、`execFileSync`

`spawn`**是最基本的创建子进程函数，其他方法都是对此的封装**

- `spawn`：通过监听子进程对象的 `stdout`、`stderr`，实时接收 指令执行输出、异常

```
#!/usr/bin/env node

import {
    spawn
} from 'child_process';

const child = spawn('npm', ['install']);

child.stdout.on('data', function (data) {
    console.log(data);
});

child.stderr.on('data', function (data) {
    console.log('Error:', data);
});
```

- `exec` 与 `spawn` 的差异点，如下
  - 指令描述简单：更接近 shell 指令，`spawn` 以数组参数描述，不方便编写
  - `exec`方方多一个回调函数，可以统一输出 子进程执行指令的数据
  - 统一输出的子进程数据量限制：默认 200kb，超出会报错中止程序，默认值可以调大，但总是有风险

```
#!/usr/bin/env node

import {
    exec
} from 'child_process';

const child = exec('npm install', function (err, stdout, stderr) {
    if (err) throw err;
    console.log(stdout);
});

child.stdout.on('data', function (data) {
    console.log(data);
});

child.stderr.on('data', function (data) {
    console.log('Error:', data);
});
```

- `execFile` 与 `exec` 特性一致，用于执行脚本文件
- `fork`：与 `spawn` 的差异点是，父子进程可以主动通信（EventEmitter 模块接口实现的）

```
// parent.js
const {fork} = require('child_process');
const forked = fork('child.js');
forked.on('message', (msg) => {
    console.log('messsgae from child', msg);
});

forked.send({hello: 'world'});
```

```
// child.js
process.on('message', (msg) => {
    console.log('message from parent:', msg);
});
let conter = 0;
setInterval(() => {
    process.send({counter: counter++});
}, 1000);
```

#### 方案二：工具库 shell.js

**shell.js 模块重新包装了 child_process，调用系统命令更加方便，对 Node 版本要求不高**

```
const shell = require('shelljs');

// 判断是否有相关开发环境
function hasGitNpm() {
  if (!shell.which('git')) {
    console.log('Sorry, this script requires git');
    shell.exit(1);
  }

  if (!shell.which('npm')) {
    console.log('Sorry, this script requires npm');
    shell.exit(1);
  }
}

hasGitNpm();

// 安装 npm 包
function installPkg(pkg, type) {
  const npm = shell.which('npm');
  if (!npm) {
    console.log('请先安装 npm');
    return;
  }
  const { code } = shell.exec(
    `${npm.stdout} install ${pkg} ${type || '--save'}`
  );
  if (code) {
    console.log(`安装 ${pkg} 失败，请手动安装`);
  }
}
```

#### 方案三：工具库 [zx](https://github.com/google/zx)

**zx 基于 child_process，调用系统命令，更接近于写 shell 语句，对 Node 环境要求 >= 16.0.0**

**特点：**

- 语法更接近 shell 语句
- 支持 ts，自动编译.ts 为.mjs 文件，.mjs 文件是 ESM 文件，直接使用 `import`，不用工具转移
- 自带 fetch 库，可以进行网络请求
- 自带 chalk 库，可以打印有颜色的字体
- 自带错误处理 nothrow 方法，如果 bash 命令出错，可以包裹在这个方法里忽略错误
- 自带支持管道操作 pipe 方法

**示例：**

执行指令 `zx ./index.mjs` 运行如下脚本

```
#!/usr/bin/env zx

await $`cat package.json | grep name`

let branch = await $`git branch --show-current`
await $`dep deploy --branch=${branch}`

await Promise.all([
  $`sleep 1; echo 1`,
  $`sleep 2; echo 2`,
  $`sleep 3; echo 3`,
])

let name = 'foo bar'
await $`mkdir /tmp/${name}`
```

## 六、npm script 高频操作

### 6.1、命令行传参

**方式一：** Node 文件中获取命令行参数，借助 `cross-env`

- 传参

```
{
    "scripts": {
        "test": "cross-env NODE_ENV=production node ./src/index.js"
    }
}
```

- 获取：`./src/index.js` 文件中获取如下

```
console.log(process.env.NODE_ENV)
```

**方式二：** Shell 文件中获取命令行参数，借助 `cross-env-shell`

- 传参

```
{
    "scripts": {
        "test": "cross-env-shell GREETING=Hi sh ./src/index.sh"
    }
}
```

- 获取：`./src/index.sh` 文件中获取如下

```
echo $GREETING
```

**方式三：** Node 文件中获取命令行参数，借助进程参数 `process.argv`

- 传参

```
{
    "scripts": {
        "test": "node ./src/index.js -build --show"
     }
}
```

- 获取：`./src/index.js` 文件中获取如下

```
#!/usr/bin/env node
import minimist from 'minimist';

// 方式1
console.log('hello ', process.argv.splice(2)); // ['-build', '--show']

// 方式2
const isShow = require('minimist')(process.argv.slice(2)).show;
```

### 6.2、自定义命令

**定义命令：** 在 package.json 文件的 `scripts` 字段中声明，命令值为 Shell 语法

```
{
  "scripts": {
    "dev": "npm run start"
  }
}
```

**执行命令**：项目根目录执行 `npm run xxx`

**执行原理**：执行指令时，会自动创建一个临时 Shell 脚本，执行命令

| 符号 | 解释                                 |
| ---- | ------------------------------------ |
| `*`  | 表示任意脚本名，防止被转译，需要 `*` |
| `**` | 表示任意层目录                       |
| `&`  | 连接命令，并行执行                   |
| `&&` | 连接命令，串行执行                   |

```
{
    "scripts": {
        "lint": "jshint **/*.js",
        "test": "tap test/*.js",
        "build1": " npm run script1.js & npm run script2.js"
        "build2": " npm run script1.js && npm run script2.js"
    }
}
```

### 6.3、自定义命令钩子

- npm 提供了 `pre` 和 `post` 两个钩子，分别代表**前置钩子、后置钩子**
- 自定义命令也可以添加 前置、后置钩子

```
{
    "scripts": {
        "lint": "jshint **/*.js",
        "test": "tap test/*.js",
        "build": " npm run script1.js & npm run script2.js"
        "prebuild": " npm run script1.js && npm run script2.js"
    }
}
```

- 执行 `npm run build` 时，相当于依次执行如下

```
npm run prebuild
npm run build
npm run postbuild
```

### 6.4、获取 script 命令名

```
const TARGET = process.env.npm_lifecycle_event;

if (TARGET === 'test') {
  console.log(`正在执行 npm run test`);
}
```

## 七、Node 工具库清单

整理了一份尽量全的 Node 工具库清单~

分 5 类（**命令行交互、文件处理、数据处理、邮件处理、网络部署**）展示 190+ Node 工具库！

### 7.1、命令行交互

| 库 | 场景 |
| --- | --- |
| Commander.js | 完整的 node.js 命令行解决方案 |
| Inquirer.js | 一组通用的交互式命令行用户界面 |
| [cross-spawn](https://github.com/moxystudio/node-cross-spawn) | 兼容 node 子进程 spawn 跨平台 |
| [semver](https://github.com/npm/node-semver) | 根据 Semver 语义规范，对比 获取版本号 |
| [pkginfo](https://github.com/indexzero/node-pkginfo) | 获取 package.json 内容 |
| [yargs](https://github.com/yargs/yargs) | 更简易的处理命令行参数小工具，比 commander.js 优秀的是参数不全会自动给出提示 |
| [ora](https://github.com/sindresorhus/ora) | 在命令行显示 loading 等动画 |
| [minimist](https://github.com/substack/minimist) | 简单的参数处理包，对 process.argv.slice(2) 数组进行 key-value 处理 |
| [figlet](https://github.com/patorjk/figlet.js) | 输出终端图案 [FIGlet 初识](https://aotu.io/notes/2016/11/22/figlet/index.html) |
| [TheaterJS](https://github.com/Zhouzi/TheaterJS) | 模拟人打字效果的 JS 库 |
| [screenfull.js](https://github.com/sindresorhus/screenfull.js) | 全屏滚动插件 |
| [image-compress-without-backend](https://github.com/zerosoul/image-compress-without-backend/blob/master/demo.pc.png) | 浏览器端图片压缩工具 无后端 |
| [zooming](https://github.com/kingdido999/zooming) | 前端 zoom 放大、缩小镜功能 |
| [html5tooltipsjs](https://github.com/ytiurin/html5tooltipsjs) | 鼠标移入后出现 tooltip 提示框 |
| [ua-parser-js](https://github.com/faisalman/ua-parser-js) | 获取浏览器信息 |
| [open](https://github.com/sindresorhus/open) | 自动打开浏览器页面 |
| [Alertify.js](http://alertifyjs.com/) | 开发漂亮的浏览器对话框和通知，可替代浏览器默认对话框 |
| [browser-sync](https://github.com/BrowserSync/browser-sync) | 取代 LiveReload 为新型浏览器自动刷新插件，提高多浏览器开发效率 |
| [node-inspector](https://github.com/node-inspector/node-inspector) | 在浏览器中调试 node [参考](https://github.com/node-inspector/node-inspector#quick-start) |
| envinfo | 生成故障排除软件问题(如操作系统、二进制版本、浏览器、已安装语言等)时所需的通用详细信息的报告 |
| bcat | 将命令管道输出到 Web 浏览器 |
| browser-run | 在浏览器环境中轻松运行代码 |
| log-symbols | 用不同颜色的符号记录不同级别的日志 |
| figures | 支援 Windows CMD 回退方案的 Unicode 符号 |
| boxen | 在终端中创建方框 |
| terminal-link | 在终端中创建可点击的链接 |
| terminal-image | 在终端里展示图片 |
| string-width | 获取字符串的可视宽度，显示字符串所需的列数 |
| cli-truncate | 在终端中将字符串截断为特定宽度 |
| first-run | 检查是否是第一次运行该进程 |
| blessed | 类似于 Curses 的库 |
| Inquirer.js | 交互式的命令行提示工具 |
| yn | 将包含 yes/no 语义的字符串解析为布尔值 |
| cli-table3 | 漂亮的 Unicode 表 |
| drawille | 使用 Unicode 盲文字符在终端上绘图 |
| update-notifier | 升级 CLI 应用程序的通知 |
| ascii-charts | 终端下的 ASCII 柱状图 |
| progress | 灵活的 ASCII 进度条 |
| insight | 使用 metrics 向 Google Analytics 发送匿名报告来帮助你理解你的工具是怎样被使用的 |
| cli-cursor | 显示或关闭 CLI 光标 |
| columnify | 将控制台文本打印按列输出，支持单元格修饰 |
| cli-columns | 列式输出 Unicode 和 Ansi-safe |
| cfonts | 控制台下的性感 ASCII 字体 |
| multispinner | 多样的、可同时独立控制的 CLI 旋转指示器 |
| omelette | Shell 下的自动补全 |
| cross-env | 跨平台的环境变量设置 |
| shelljs | 可移植的 Unix shell 命令 |
| sudo-block | 禁止用户用 root 权限使用你的程序 |
| loud-rejection | 强制对未加处理的 promise rejections 错误给出提示 |
| sparkly | 生成迷你图 `▁▂▃▅▂▇` |
| Bit | 在存储库中创建、维护、查找和使用小型模块和组件 |
| gradient-string | 为终端输出添加漂亮的色彩渐变 |
| oclif | CLI 框架，包括解析器、自动文档、测试和插件 |
| term-size | 准确地获得终端窗口大小 |
| Cliffy | CLI 的交互式框架 |
| np | 更好的 `npm publish` |
| npm-name | 检查包名在 npm 上是否可用 |
| gh-home | 打开当前目录下项目的 GitHub 主页 |
| npm-home | 打开一个包的 npm 主页 |
| emoj | 命令行下从文本中查找相关的 emoji |
| pageres | 获取网站的截图 |
| vtop | 有漂亮图表的更好用的 top |
| clipboard-cli | 在终端里复制粘贴 |
| dev-time | 获取 GitHub 用户当前的本地时间 |
| David | 当 npm 软件包中的依赖过时通知你 |
| normit | 在您的终端中使用语音合成功能进行 Google 翻译 |
| fkill | 跨平台的进程强杀命令 |
| pjs | 用 JavaScript 实现的快速过滤、映射和累加器的管道命令 |
| license-checker | 对你应用中的依赖进行许可证检查 |
| tmpin | 对所有允许文件输入的 CLI 程序添加 stdin 支持 |
| wallpaper | 更换桌面壁纸 |
| brightness | 更改屏幕亮度 |
| alex | 捕捉写作中出现的不当表达 |
| subdownloader | 电影和电视剧的字幕下载器 |
| dark-mode | 开关 macOS 暗黑模式 |
| Jsome | 使用自定义颜色和缩进打印漂亮的 JSON |
| itunes-remote | 交互式控制 iTunes |
| mobicon | 移动端应用图标生成器 |
| mobisplash | 移动端应用启动页生成器 |
| diff2html-cli | 生成漂亮的 HTML 展示 git diff 命令的结果 |
| Cash | 用纯 JavaScript 编写的跨平台类 Unix Shell |
| trymodule | 在终端中使用 npm 软件包 |
| jscpd | 源代码重复代码检测 |
| atmo | 模拟服务器端 API |
| auto-install | 编写代码时自动安装依赖 |
| cost-of-modules | 查找使性能降低的依赖 |
| localtunnel | 向公网开放你的 localhost |
| svg-term-cli | 基于 SVG 分享终端会话 |
| gtop | 终端下的系统监控仪表板 |
| themer | 为您的编辑器、终端、壁纸、Slack 等生成主题 |
| carbon-now-cli | 为你的代码生成精美的图片 |
| taskbook | 命令行环境下的任务、板块和笔记管理器 |

### 7.2、文件处理

| 库 | 场景 |
| --- | --- |
| [glob](https://www.npmjs.com/package/glob) | 很便捷的获取文件（循环 + 正则） |
| [fs-extra](https://github.com/jprichardson/node-fs-extra) | 读 fs 模块的增强版，兼容 fs |
| [chokidar](https://github.com/paulmillr/chokidar) | 监听文件变动，代替 fs.watch 高性能 |
| [dotenv](https://github.com/motdotla/dotenv) | 可以将.env 文件内包含的变量，自动注入到 process.env 中 |
| [onchange](https://github.com/Qard/onchange) | 监听文件变化并自动运行 npm script |
| [cpx2](https://www.npmjs.com/package/cpx2) | 监听文件变化，自动拷贝 |
| [readable-stream](https://github.com/nodejs/readable-stream) | stream 处理库 |
| [temp](https://www.npmjs.com/package/temp) | 临时文件操作库 |
| [mkdirp](https://github.com/substack/node-mkdirp) | 新建文件夹，省去 新建、进入、新建 等繁琐步骤 |
| [ejsExcel](https://github.com/sail-sail/ejsExcel) | 是一个 Excel 模版引擎，可以在格式复杂的 excel 中填入信息 |
| [markdown](https://github.com/younghz/Markdown) | 把 markdown 字符转为 html 字符 |
| [markdown-it](https://github.com/markdown-it/markdown-it) | 新型 Markdown 解析器，快速，支持插件 |
| trash | 比 `rm` 更安全的选择」 |
| cpy | 复制文件 |
| empty-trash | 清空文件夹 |
| npkill | 轻松查找和删除过时且臃肿的 node_modules 文件夹 |
| pen | 用你喜爱的编辑器编写 Markdown，在浏览器中提供实时预览 |
| lessmd | 终端环境下的 Markdown 预览器 |
| cpy | 文件拷贝 |
| rimraf | 像 rm -rf 一样的递归删除 |
| make-dir | 像 mkdir -p 一样的递归创建目录 |
| graceful-fs | 功能增强版的 fs 模块 |
| chokidar | 像 macOS 上使用原生 fsevents 一样监听 fs.watch 和 fs.watchFile 的文件系统监听器 |
| find-up | 沿父目录向上查找文件 |
| proper-lockfile | 进程间和机器间 lockfile 工具 |
| load-json-file | 读取、解析 JSON 文件 |
| write-json-file | 自动将 JSON 序列化写入到文件 |
| fs-write-stream-atomic | 类似 fs.createWriteStream() 的原子操作 |
| filenamify | 将字符串转换为有效的文件名 |
| lnfs | 像 ln -fs 一样，强制创建符号链接 |
| istextorbinary | 检查文件是文本还是二进制 |
| fs-jetpack | 完全重新设计的、方便日常使用的文件系统 API |
| fs-extra | 增加额外方法的 fs 模块 |
| pkg-dir | 查找 npm 包的根目录 |
| filehound | 灵活、流畅的用于文件系统搜索的接口 |
| move-file | 甚至可以跨设备使用的移动文件工具 |
| tempy | 随机获取临时文件或目录的路径 |

### 7.3、数据处理

| 库 | 场景 |
| --- | --- |
| [nanoid](https://github.com/ai/nanoid) | 生成唯一的字符串 ID |
| [pinyin](https://github.com/hotoo/pinyin) | 前端/nodejs 汉字转拼音 |
| [lunr.js](http://rank.chinaz.comwww.febeacon.com/lunr-docs-zh-cn/) | 全文搜索引擎，可以为 JSON 创建索引 并 检索 |
| [crypto-js](https://github.com/brix/crypto-js) | crypto-js 是一个强大的加密库，支持大量加密算法 |
| [decimal.js](https://github.com/MikeMcl/decimal.js/) | 是一个科学计算库，可以进行任意精度的十进制运算 |
| [validator](https://github.com/validatorjs/validator.js) | 验证库 |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 生成与解析 token [参考](https://github.com/auth0/node-jsonwebtoken) |
| [json5](https://github.com/json5/json5) | JSON5 是对 JSON 的扩展，JSON 格式更加宽泛 [参考](https://github.com/json5/json5) |
| [jsondiffpatch](https://github.com/benjamine/jsondiffpatch) | 对比 JSON，生成 diff、patch 信息 [参考](https://github.com/benjamine/jsondiffpatch) |
| [joi](https://github.com/sideway/joi) | JavaScript 最强大的模式描述语言和数据验证器 |
| [ajv](https://github.com/ajv-validator/ajv) | JSON Schema 验证工具，最快的 JSON 概要验证器，支持 v5、v6 和 v7 方案 |
| [superstruct](https://github.com/ianstormtaylor/superstruct) | json/js 对象 验证 validate 库 |
| yaml-front-matter | 解析 yaml 或 json |
| hash-sum | 非常快的唯一哈希生成器 |
| deepmerge | 深度合并两个或多个对象的可枚举属性。 |
| leven | 测量两字符串之间的差异最快的 JS 实现之一 |
| lru cache | 删除最近最少使用的项的缓存对象 |
| strip-ansi | 从字符串中去掉 ANSI 转义码 |
| is-my-json-valid | 极速 JSON 格式校验工具 |
| property-validator | 用于 Express 的属性校验工具 |
| schema-inspector | JSON API 清理和验证 |
| Superstruct | 简单基础的 JavaScript 和 TypeScript 数据验证器 |

### 7.4、邮件处理

| 库 | 场景 |
| --- | --- |
| [nodemailer](https://www.cnblogs.com/HJ412/p/11560364.html) | 处理电子邮件的最快方式 |
| emailjs | 向任何 SMTP 服务器发送带有附件的文本 / HTML 电子邮件 |
| email-templates | 创建、预览和发送自定义电子邮件 |
| MJML | 旨在减少创建响应式电子邮件困难的一种标记语言 |

### 7.5、网络部署

| 库 | 场景 |
| --- | --- |
| [nodemon](https://github.com/remy/nodemon) | 支持热加载和自动重启，可以检测代码文件变化，并实时重启程序，适合开发阶段使用！ |
| [pm2](https://github.com/Unitech/pm2) | 支持热启动、负载、集群、监控、重启等功能，一旦 node.js 程序崩溃，pm2 可以自动重启 Node.js 程序 |
| [http-server](https://github.com/http-party/http-server) | 零配置启动一个 HTTP 服务，访问 html 文件 |
| [json-server](https://github.com/typicode/json-server) | 启动服务 访问 json |
| [http-proxy](https://github.com/http-party/node-http-proxy) | node http 代理库，使用起来较原生 |
| [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) | http 代理库，express 中间件 |
| [socket.io](https://github.com/socketio/socket.io) | 用极其简单的语法，在服务端与客户端之间，建立可靠的 webSocket 长连接通信 |
| [oauth](https://github.com/nodejs/readable-stream) | oauth 认证库 |
| torrent | 下载种子 |
| iponmap | IP 地址查找器 |
| speed-test | 测试你的互联网连接速度和 ping 值 |
| discharge | 轻松将静态网站部署到 Amazon S3 |
| wifi-password | 获取当前 wifi 的密码 |
| download-git-repo | 拉取 Git 代码 |
| default-gateway | 通过对 OS 路由接口的 exec 调用获得机器的默认网关 |
| address | 获取当前机器的 IP, MAC 和 DNS 服务器。 |
| portfinder | 自动寻找  `8000`至`65535`内可用端口号 |
| is-up | 检测网站是否可以正常访问 |
| is-online | 检测网络连接是否正常 |
| public-ip | 获取你的公网 IP 地址 |
| got | 为内置的 http 模块提供更好的接口 |
| gh-got | 为 got 和 GitHub API 交互提供更方便的封装 |
| axios | 基于 Promise 的 HTTP 客户端（也可以在浏览器中工作） |
| wreck | HTTP 客户端工具. |
| download | 使下载和提取文件变得轻松 |
| http-proxy | HTTP 代理 |
| superagent | HTTP 请求库 |
| node-fetch | Node.js 的 window.fetch |
| flashheart | REST 客户端 |
| http-fake-backend | 使用 JSON 文件或者 JavaScript 对象 建立一个伪装的可自定义路由的后端服务 |
| cacheable-request | 使用符合 RFC 的缓存支持封装原始的 HTTP 请求. |
| gotql | 基于 got 构建的 GraphQL 请求库 |
| global-agent | 可以使用环境变量配置的全局 HTTP / HTTPS 代理 |
| smoke | 可记录的基于文件的模拟 HTTP 服务 |
| http-server | 简单、零配置的命令行 HTTP 服务器 |
| Live Server | 具有热重启功能的开发环境 HTTP 服务器 |
