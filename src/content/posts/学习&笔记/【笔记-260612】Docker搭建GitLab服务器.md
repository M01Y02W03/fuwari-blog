---
title: 【笔记】Docker 搭建 GitLab 服务器
published: 2026-06-12
description: 使用 Docker 部署 GitLab CE 社区版完整教程 | 配置、端口映射、常见问题
image: https://jzzt-resources.oss-cn-hangzhou.aliyuncs.com/obsidian/posts-image/20260612213046923.png
tags:
  - Docker
  - GitLab
  - DevOps
category: 学习&笔记
draft: false
lang: ""
---

## 1. 拉取 GitLab 镜像

```bash
# 拉取 GitLab CE（社区版）最新镜像
docker pull gitlab/gitlab-ce:latest
```

---

## 2. 启动 GitLab 容器

```bash
docker run \
 -itd  \
 -p 9980:80 \
 -p 9922:22 \
 -v /home/gitlab/etc:/etc/gitlab  \
 -v /home/gitlab/log:/var/log/gitlab \
 -v /home/gitlab/opt:/var/opt/gitlab \
 --restart always \
 --privileged=true \
 --name gitlab \
 gitlab/gitlab-ce
```

### 参数说明

| 参数                  | 说明                             |
| ------------------- | ------------------------------ |
| `-itd`              | 交互模式 + 伪终端 + 后台运行              |
| `-p 9980:80`        | 宿主机 9980 端口 → 容器 80 端口（Web 访问） |
| `-p 9922:22`        | 宿主机 9922 端口 → 容器 22 端口（SSH）    |
| `-v`                | 目录挂载（配置、日志、数据）到宿主机             |
| `--restart always`  | 容器自动重启                         |
| `--privileged=true` | 获取宿主机 root 权限                  |
| `--name gitlab`     | 容器名称                           |

> ⚠️ **注意**：后续配置请在容器内修改，不要直接改宿主机挂载文件，否则可能不生效。

---

## 3. 修改 GitLab 配置

### 3.1 进入容器

```bash
docker exec -it gitlab /bin/bash
```

### 3.2 修改 `gitlab.rb`

```bash
vi /etc/gitlab/gitlab.rb

# 在 vi 中：
# 1. 按 Shift + G 直接跳到文件末尾开始添加配置
# 2. 按 i 进入插入模式开始编辑
# 3. 添加 external_url 等配置
# 4. 按Esc退出编辑模式
# 5. :wq保存并退出|:w仅保存，不退出|:q不保存退出|:q!强制不保存退出|:wq强制保存并退出
```

添加以下内容：

```ruby
# GitLab 访问地址（HTTP）：宿主机的IP或分配给宿主机的公网IP
external_url 'http://192.168.1.192:9980'

# SSH 主机 IP
gitlab_rails['gitlab_ssh_host'] = '192.168.1.192'

# SSH 连接端口（映射后的宿主机端口）
gitlab_rails['gitlab_shell_ssh_port'] = 9922

# 指定 nginx 监听 80 端口
nginx['listen_port'] = 80
```

### 3.3 使配置生效

```bash
gitlab-ctl reconfigure
```

>![](https://jzzt-resources.oss-cn-hangzhou.aliyuncs.com/obsidian/posts-image/20260612190734968.png)

### 3.4 修改 `gitlab.yml`（重要）

因为 HTTP 端口映射为 `9980`，需要同步修改：

```bash
vi /opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml
```

找到 `gitlab` 部分，修改为：`external_url`填写时加上了端口号`9980`则不需要

```yaml
gitlab:
  host: 192.168.1.192
  port: 9980   # 关键：改为映射后的端口
  https: false
```

>![](https://jzzt-resources.oss-cn-hangzhou.aliyuncs.com/obsidian/posts-image/20260612191122389.png)


### 3.5 重启 GitLab 并退出容器

```bash
gitlab-ctl restart
exit

# 其它常用指令
# 停止容器
docker stop 容器名
# 删除容器
docker rm 容器名
```

---

## 4. 浏览器访问

访问地址：`http://192.168.1.192:9980/`

> ⚠️ **要求**：宿主机内存 ≥ 4G，否则 GitLab 可能启动失败（502 错误）。

- 首次访问会提示设置 **root 密码**
- 设置完成后使用 `root` 用户登录
- 管理员账号`root`&`R@nd0m!P@ssw0rd#2026`
>![](https://jzzt-resources.oss-cn-hangzhou.aliyuncs.com/obsidian/posts-image/20260612212931370.png)

- 普通用户账号
>![](https://jzzt-resources.oss-cn-hangzhou.aliyuncs.com/obsidian/posts-image/20260612213046923.png)



---

## 5. 修改 root 密码（命令行方式）

如果需要通过命令行修改密码：

```bash
# 进入容器
docker exec -it gitlab /bin/bash

# 进入 Rails 控制台
gitlab-rails console -e production

# 查找 root 用户（id=1）
user = User.where(id:1).first

# 修改密码
user.password='你的新密码'

# 保存
user.save!

# 退出
exit
```

✅ 至此，Docker 部署 GitLab 服务器完成。
