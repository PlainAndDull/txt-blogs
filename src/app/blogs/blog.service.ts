import { Injectable } from '@angular/core';
import { Blog } from './blog';
import { Http, Response } from '@angular/http';

@Injectable()
export class BlogService {
    private blogsUrl = '/api/blogs';

    constructor (private http: Http) {}

    getBlogs(): Promise<void | Blog[]> {
      return this.http.get(this.blogsUrl)
                 .toPromise()
                 .then(response => response.json() as Blog[])
                 .catch(this.handleError);
    }

    createBlog(newBlog: Blog): Promise<void | Blog> {
      return this.http.post(this.blogsUrl, newBlog)
                 .toPromise()
                 .then(response => response.json() as Blog)
                 .catch(this.handleError);
    }

    deleteBlog(delBlogId: String): Promise<void | String> {
      return this.http.delete(this.blogsUrl + '/' + delBlogId)
                 .toPromise()
                 .then(response => response.json() as String)
                 .catch(this.handleError);
    }

    updateBlog(putBlog: Blog): Promise<void | Blog> {
      var putUrl = this.blogsUrl + '/' + putBlog._id;
      return this.http.put(this.blogsUrl, putBlog)
                 .toPromise()
                 .then(response => response.json() as Blog)
                 .catch(this.handleError);
    }

    private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg);
    }
}
