import { useRef } from "react";
import "./App.css";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// posts -> ["posts"]
// posts/1 -> ["posts",post.id]
// posts?authorId=1 -> ["posts",{authorId:1}]
// posts/2/comments -> ["posts",post.id,"comments"]

function App() {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    queryKey: ["posts"],
    queryFn: async () =>
      await (await fetch("http://localhost:3000/posts")).json(),
  });

  const newPostMutation = useMutation({
    mutationFn: async (post) => {
      await fetch(`http://localhost:3000/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Date.now(), title: post }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, val }) => {
      return await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: val }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (postQuery.isLoading) return <h1>Loading...</h1>;

  if (postQuery.error) return <pre>{JSON.stringify(postQuery.error)}</pre>;

  console.log(postQuery);

  return (
    <>
    <h1 style={{textAlign:"center"}}>Todo Item React Query</h1>

      <div className="add">
        <input type="text" ref={ref} />
        <button
          disabled={newPostMutation.isLoading}
          onClick={() => newPostMutation.mutate(ref.current.value)}
        >
          Add New
        </button>
      </div>

      <div className="main">
      
      {postQuery.data.map((el) => (
        <>
          <div key={el.id}>{el.title}</div>
          <button onClick={() => deleteMutation.mutate(el.id)}>delete</button>
          <input type="text" ref={ref2} />
          <button
            onClick={() =>
              editMutation.mutate({ id: el.id, val: ref2.current.value })
            }
          >
            Edit
          </button>
        </>
      ))}
      </div>
    </>
  );
}

export default App;

// const postQuery = useQuery({
//   queryKey:["posts"],
//   queryFn: obj=>
//     wait(1000).then(()=>{
//     console.log(obj)
//     return [...POSTS]
//   }),
//   refetchInterval:1000 -> refetch the data every one second
// })

// const postQuery1 = useQuery({
//   queryKey:["posts",1],
//   queryFn: obj=>
//     wait(1000).then(()=>{
//     console.log(obj)
//     return [...POSTS].filter((el)=> el.id === 1)
//   })
// })

// function wait(duration){
//   return new Promise(resolve=>setTimeout(resolve,duration));
// }

{
  /* {postQuery1.data.map((el)=>(
        <div key={el.id}>{el.title}</div>
      ))} */
}
