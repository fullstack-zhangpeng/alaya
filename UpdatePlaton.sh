#!/bin/bash

newVersion=platon0.15.0

# 更新
sudo apt update
# 卸载当前安装版本
sudo apt remove `apt search platon|awk -F/ '/installed/{print $1}'` --purge -y  
# 安装新版platon
sudo apt install -y $newVersion
echo "---🎉 Install $newVersion Done---"
# 查看版本
platon version
