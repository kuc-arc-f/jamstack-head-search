import Link from 'next/link';
import Head from 'next/head';
//
export default function(){
  return (
  <div id="div_navigate_index">
    <div id="div_head" className="cover">
      <div className="container">
          <div className="row">
              <div className="col-sm-4">
                <a href="/"><p><i className="fas fa-home"></i></p>
                </a>
              </div>
              <div className="col-sm-8">
              </div>
          </div>
      </div>
    </div>
  </div>
  );
}
