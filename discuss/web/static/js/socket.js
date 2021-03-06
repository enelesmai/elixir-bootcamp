import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

const createSocket = (topicId) => {
  let channel = socket.channel(`comments:${topicId}`, {})
  channel.join()
    .receive("ok", resp => { 
      renderComments(resp.comments);
    })
    .receive("error", resp => { console.log("Unable to join", resp) })

  channel.on(`comments:${topicId}:new`, renderComment);

  document.querySelector('button').addEventListener('click', () => {
    const content = document.querySelector('textarea').value;
    channel.push('comment:add', { content: content });
  });
}

function commentTemplate(comment){
  let email = "Anonymous";
  if (comment.user) {
    email = comment.user.email;
  }
  return `
  <li class="collection-item">
    ${comment.content}
    <div class="secondary-content">
      ${email}
    </div>
  </li>
`;
}

function renderComment(event){
  const renderedComment = commentTemplate(event.comment);
  document.querySelector(".collection").innerHTML += renderedComment;
}

function renderComments(comments) {
  const renderedComments = comments.map(comment => {
    return commentTemplate(comment);
  });

  document.querySelector(".collection").innerHTML = renderedComments;
}

window.createSocket = createSocket;

/*  document.querySelector('button').addEventListener('click', function(){
    channel.push('comment:hello', {hi: 'there!'});
  });


export default socket
*/