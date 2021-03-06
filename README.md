# photoShares

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

所以是这么回事，myPhoto component在constructor阶段向server发request，server用client的ID，把photo list 缝好发回去
myPhoto 把这些个缝合贵物排列成Items
data需求：photo_ID, photo url，但我觉得把description和date放这儿也ojbk，免得要comment的时候还得把description缝进来，反正也没多几个bytes嘛

点开某个具体的Item，在madel的constructor阶段，再用photo_id向server发信，把该photo的comments再摸过来
data需求：list of Comments obj
单个Comments obj包括creator_id，content，date/time