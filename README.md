# photoShares，姑且算是开发日志的草稿？

## 下载自己上传过的图片
- 先在react上套娃，把乌龟壳的结构嵌套好：

myPhotos 这个component：
List of photoHolders // function：无限滚动？没兴趣，狗都不写

Item:
-- authorInfo栏：头像，userName // function：关注？
-- 照片本体 + description // function：点赞投币收藏三连
-- List of CommentHolders //function：点赞点踩？这就别搞了吧，和photo的点赞不是一回事？要按照点赞数排列也就在client controller里玩排列组合，差不多得了
-- newCommentHolder// function：写评论

CommentHolder:
-- 作者
-- comment 本体
-- date + time

newCommentHolder：
-- textarea
-- submit按钮

- 思考下data model 怎么弄？
问：这些大猫小猫两三只的components们，都要找server要哪些data？
用bottom-up的思路。
CommentHolder： Photo A下的所有comment obj，里面有所有单条评论的info

photoHolder： 单张photo A的url

autorInfo：photo A的作者的部分信息（这部分没必要显示了吧？my photo又不是看别人的，设置一个toggle隐藏掉）

整理下，所以是这么回事，myPhoto component在constructor阶段向server发request，server用client的ID，把photo list 缝好发回去
myPhoto 把这些个缝合贵物排列成Items
data需求：photo_ID, photo url，但我觉得把description和date放这儿也ojbk，免得要comment的时候还得把description缝进来，反正也没多几个bytes嘛

点开某个具体的Item，在madel的constructor阶段，再用photo_id向server发信，把该photo的comments再摸过来
data需求：list of Comments obj
单个Comments obj包括creator_id，content，date/time

我又仔细寻思了以下，在panel这一层搞followList生成友情表的时候，已经把friends的obj搞到Panel下了，按理来说，点了按钮，把对应的obj当props传入<PhotoList>就行了，url随便瞎编一个长的好看的，名字叫啥url里放啥，反正都是#后面的，url长得好看第一重要。
但是，frindList里要有两个Justin，那可砸整啊，我个写app的倒无所谓，state里面留个空，user点了哪个，传参传哪个。或者用Portol把对应的View缝进主视图，再随便编个url糊弄一下也是行的。但Mendel那老头神神叨叨的deep linking！就做不了了嘛，都两个Justin了，怎么保证unique？
思来想去，还是只能把user_id放进url里，进了Component再Request一次。
又要url长得好看，还得保证它unique，我又寻思了一下，只能在react前端自写一个parse函数，把url转成带id的，或者补些参数进去，用post之类发到后端。其实这么搞也不是不行，但无论怎样，反正要有一个能当uid的东西，啊这，我后端又没写姓名唯一性检测，就算有，你也不能强迫人家不能叫Justin啊，破站都有个av123456，这个是unique的啊，横竖都要个id，名字，它也只是个id而已。
算了算了，反正电脑发request，又不是我打字，差不多得了。

day

task：浏览收藏夹页面
1. React Bootstrap造Favorite List这个大乌龟壳
- 把<Route>和<Link> 接上
- 调试 Grid设置： xs=12， sm=6， lg=4， xl=3， 这布局，典。

2. 用axios找后端拿Favorte list的数据
3. 把后端给Favorite list 的API写了
- get, delete
4. 回前端来，拿着新到手的PhotoList Model，把放图片那个小乌龟壳Thumbnail写了
- 用<Image thumbnail>放图
- 我寻思了一下，虽然<Card>能整，但怎么想还是<Toast>实用，有个叉叉在右上角，至少方便写删除收藏的event
5. 把放大图片的<Modal>写了