import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  
  constructor(private storage: Storage) {
    this.init();
  }
  
  get localArticles() {
    return this._localArticles;
  }

  async init() {
    this._storage = await this.storage.create();
    this.getBookmarkedArticles();
  }

  async bookmarkAction(article: Article) {
    const alreadyExists = this._localArticles.find(savedArticle => savedArticle.title === article.title);
    if (alreadyExists) {
      this._localArticles = this._localArticles.filter(savedArticle => savedArticle.title !== article.title);
    } else {
      this._localArticles = [article, ...this._localArticles];
    }
    this._storage.set('articles', this._localArticles);

  }

  async getBookmarkedArticles() {
    try {
      const articles = await this._storage.get('articles');
      this._localArticles = articles || [];
    } catch (error) {
      
    }
  }

  isArticleBookmarked(article: Article) {
    return !!this._localArticles.find(savedArticle => savedArticle.title === article.title);
  }
}
