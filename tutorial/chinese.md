# GeoFS LiverySelector用户手册
您好，欢迎使用GeoFS LiverySelector插件！在继续操作之前，请阅读以下内容，以确保顺利使用该插件。

安装好相应的代码并启动 GeoFS 后，您会在“飞机”标志小菜单右侧底部看到一个按钮。点击此按钮即可访问该插件。

飞机选择菜单中还会出现一些图标……
* <img width="15" height="30" alt="logosmall" src="https://raw.githubusercontent.com/RYANAIR5719/GEOFS-LiverySelector/refs/heads/main/logosmall.png" />图标表示该飞机支持此插件。
* 🎮表示该飞机与多人游戏兼容（装了插件的玩家，他们可以看到您使用的涂装）。
* 🥇、🥈或🥉表示该涂装曾赢得过在我们在Discord上举行的涂装比赛。

## 插件界面
Once you click on that <img width="15" height="30" alt="logosmall" src="https://raw.githubusercontent.com/RYANAIR5719/GEOFS-LiverySelector/refs/heads/main/logosmall.png" /> button, an interface should (hopefully) pop up. 由于某些机型（例如737、A320和777-300ER）的涂装数量庞大，某些机型的界面可能需要一段时间才能出现。

界面顶部附近有一个**搜索栏**，用于查找您需要的涂装。

### Favorite Liveries（收藏图装）
这里会显示所有你收藏的涂装。如果想收藏涂装，只需点击涂装旁边的星形图标，它就会显示在这里。

### Avaliable Liveries（可选图装）
这里可以找到该机型的所有涂装。每款涂装的信息分为两行，一行是名称，另一行是画师姓名。对于由 Xavier 官方发布的涂装，您还可以在其信息旁边找到一张小插图，展示其外观。

> [!NOTE]
> 某些在系统添加画室信息前录入的图装不包含此信息。

> [!IMPORTANT]
> 如果您已启用“**土豆模式**”，请改用搜索栏浏览涂装。

### Load External Liveries（加载外部涂装）
您可以在这里上传涂装进行测试，或者上传您常用的虚拟航空公司涂装。此部分包含四个不同的页面……

* **Upload（上传图装）**: 在这里将您的涂装上传到ImgBB并提交审核。在提交图装之前您需要在API标签页中进行一些设置。
* **Direct（直接上传）**: 您可以在这里直接从文件中上传涂装进行测试。
* **Download（下载涂装）**: 您可以在这里下载此飞机已公开的涂装。
* **API**: 此部分在**Upload**选项卡中设置LiverySelector的提交表格。

## 配置涂装上传器
> [!IMPORTANT]
> 本部分需要Discord和ImgBB账号。您可以在[这里](https://discord.com/register)注册Discord账号，在[这里](https://imgbb.com/signup)注册ImgBB账号。
1. 前往https://api.imgbb.com/，然后点击“添加 API 密钥”按钮。
2. 拷贝生成的API代码，并将其粘贴到“Load External Liveries”部分的API标签页中的第一个文本框中，然后按回车键。您应该会在文本框中看到这条消息：`API KEY SAVE (type CLEAR to remove)`
> [!NOTE]
> 如果您希望在一小时后从数据库中删除您的 API，文本框下方有一个复选框可以启用该选项。

3. 按照[本教程](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID)获取您的 Discord 用户 ID ，并将其粘贴到第二个框中，然后按回车键。

## 通过本插件提交涂装
> [!IMPORTANT]
> 这需要您配置上文的涂装上传工器。
1. 前往“Upload”选项卡。您应该会看到一个文本框和一个“Upload Image”（上传图片）按钮。
2. 通过文本框输入图片网址，或点击“Upload Image”从电脑上传图片来添加图片。然后点击“Load Livery”（加载涂装），涂装就会出现在飞机模型上。
3. 请检查涂装是否有任何问题，并确保其质量合格。
4. 屏幕底部附近，点击“Contribute to the LiverySelector Database“（提交审核）。
5. 第一个框填写涂装名称，第二个框填写您的用户名。
6. 勾选以下两个复选框以提交合同，然后点击“Submit Livery For Review”（提交涂装审核）。

# 联系方式
* **邮件**: <a href="LiverySelector20220816@gmail.com">LiverySelector20220816@gmail.com</a>
* **Discord**: https://discord.gg/2tcdzyYaWU
