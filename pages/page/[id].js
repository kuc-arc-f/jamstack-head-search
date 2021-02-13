import React from 'react'
//import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import Layout from '../../components/layout'
import TopHeadBox from '../../components/TopHeadBox'
import PagingBox from '../../components/PagingBox'
import IndexRow from '../IndexRow';
import LibPagenate from '../../libs/LibPagenate'
import LibCommon from '../../libs/LibCommon'
//
function Page(data) {
  var items = data.blogs
  var paginateDisp = data.display
  var page = data.page
//console.log("display=", data.display)  
  return (
    <Layout>
      <Head><title key="title">{data.site_name}</title></Head> 
      <TopHeadBox site_name={data.site_name} />
      <div className="body_main_wrap">
        <div className="container">
          <div className="body_wrap">
            <div id="post_items_box" className="row conte mt-2 mb-4">
              <div className="col-sm-12">
                <div id="div_news">
                  <h2 className="h4_td_title mt-2 mb-2" >Post</h2>
                </div>
              </div>
              {items.map((item, index) => {
//                console.log(item.id ,item.createdAt )
                return (<IndexRow key={index}
                  id={item.id} title={item.title}
                  date={item.created_at} />       
                )
              })}
              <hr /> 
              <PagingBox page={page} paginateDisp={paginateDisp} />            
            </div>
          </div>          
        </div>
      </div>
    </Layout>
    )  
}
//
export const getStaticProps = async context => {
  const page = context.params.id;
  var content = "posts"
  var site_id = process.env.MY_SITE_ID
//console.log("page=", page)
  var url_count = process.env.BASE_URL+`/api/get/count?content=${content}&site_id=${site_id}`
  const resCount = await fetch(url_count);
  const jSoncount = await resCount.json();
  const count = jSoncount.count
//console.log("count=", jSoncount.count )
  LibPagenate.init()
  var pageInfo=LibPagenate.get_page_start(page)
  var url = process.env.BASE_URL + `/api/get/find?content=${content}&site_id=${site_id}`
  url += `&skip=${pageInfo.start}&limit=${pageInfo.limit}`
  const res = await fetch(url);
  var blogs = await res.json();
  blogs = LibCommon.convert_items(blogs)
  var display = LibPagenate.is_next_display(page, parseInt(count) )
//console.log("disp=" , display)
  return {
    props : {
      blogs: blogs, display: display, page: page,
      site_name : process.env.MY_SITE_NAME,
    }
  };
}
export async function getStaticPaths() {
  var content = "posts"
  var site_id = process.env.MY_SITE_ID
  const res = await fetch(
    process.env.BASE_URL + `/api/get/find?content=${content}&site_id=${site_id}`
  );
  const blogs = await res.json(); 
//console.log( "len=", blogs.length ) 
  LibPagenate.init()
  var pageMax =LibPagenate.get_max_page(blogs.length)
//console.log( "pageMax=", pageMax)
  pageMax = Math.ceil(pageMax)
  var paths = []
  for(var i= 1 ; i<= pageMax; i++ ){
    var item = {
      params : {
        id: String(i)
      } 
    }
    paths.push(item)
  }
// console.log( paths )
  return {
    paths: paths,
    fallback: false,
  }
}

export default Page
