import React from 'react'
import Head from 'next/head';

import Layout from '../components/layout'
import TopHeadBox from '../components/TopHeadBox'
import PagingBox from '../components/PagingBox'
import LibCommon from '../libs/LibCommon'
import LibPagenate from '../libs/LibPagenate'
import LibContent from '../libs/LibContent'
import IndexRow from './IndexRow';
//
export default class Page extends React.Component {
  static async getInitialProps(context){
    var content = "posts" 
    var site_id = process.env.MY_SITE_ID
    var url = process.env.BASE_URL+`/api/get/find?content=${content}&site_id=${site_id}`
    url += `&skip=0&limit=10`    
    const res = await fetch(url );
    var blogs = await res.json();
    blogs = LibCommon.convert_items(blogs)
    var url_items = process.env.BASE_URL+`/api/get/find?content=${content}&site_id=${site_id}`
    const resItems = await fetch(url_items );
    var jsonItems = await resItems.json();
    LibPagenate.init()
    var display = LibPagenate.is_paging_display(blogs.length)          
//console.log("len=" , blogs.length, display) 
    return {
      blogs: blogs,
      site_name : process.env.MY_SITE_NAME,
      display: display,
      items_all : jsonItems,
    }
  }
  constructor(props){
    super(props) 
    this.state = { blogs : [] ,items_all:[] }    
//console.log(this.props.items_all) 
  }
  async componentDidMount(){
    this.setState({ blogs: this.props.blogs ,
      items_all: this.props.items_all,
      display: this.props.display,
    })    
  }
  async key_search(){
    var elemKey = document.getElementById('search_key');
console.log("#key_search=" , elemKey.value )
    var items = this.props.blogs
    if(elemKey.value != ""){
      items = LibContent.getTitleItems(this.state.items_all , elemKey.value )
    }
    items = LibCommon.convert_items(items)
// console.log(items)
    this.setState({ blogs: items,
      display: 0, })    
  } 
  render(){
    var items = this.state.blogs
//console.log(this.state.items_all)
    var paginateDisp = this.state.display 
    var site_name = this.props.site_name    
    return (
    <Layout>
      <Head><title key="title">{site_name}</title></Head>      
      <TopHeadBox site_name={site_name} />
      <div className="body_main_wrap">
        <div className="container">
          <div className="body_wrap">
            <div className="search_wrap mt-2">
              <input type="text" id="search_key" name="search_key" autoComplete="off" 
                className="form-control mt-2"placeholder="Search key input please" />              
              <button onClick={this.key_search.bind(this)}
               className="btn btn-sm btn-outline-primary mt-1">Search
              </button>
            </div>
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
              <PagingBox page="1" paginateDisp={paginateDisp} />
            </div>
          </div>          
        </div>
      </div>
    </Layout>
    )
  }
}
