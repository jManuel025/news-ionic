import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../interfaces/index';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article: Article;
  @Input() index: number;

  constructor(
    private iab: InAppBrowser,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private storageService: StorageService
  ) { }

  openArticle() {
    if (this.isMobile()) {
      const browser = this.iab.create(this.article.url);
      browser.show();
    } else {
      window.open(this.article.url, '_blank');
    }
  }

  async onOpenMenu() {

    const articleBookmarked = this.storageService.isArticleBookmarked(this.article);

    const buttons = [
      {
        text: articleBookmarked ? 'Unbookmark' : 'Bookmark',
        icon: articleBookmarked ? 'bookmark' : 'bookmark-outline',
        handler: () => this.onToggleBookmark()
      },
      {
        text: 'Cancel',
        icon: 'close-outline',
        handler: () => this.onClose()
      }
    ];

    const shareBtn = {
      text: 'Share',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };

    if (this.isMobile()) {
      buttons.unshift(shareBtn);
    }
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: buttons
    });

    await actionSheet.present();
  }

  onShareArticle() {
    this.socialSharing.share(
      this.article.title,
      this.article.source.name,
      null,
      this.article.url
    );
  }

  onToggleBookmark() {
    this.storageService.bookmarkAction(this.article);
  }

  onClose() {
  }

  private isMobile() : boolean {
    return this.platform.is('android') || this.platform.is('ios');
  }
}
