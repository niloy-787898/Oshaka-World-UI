import {Injectable} from '@angular/core';
import {PcBuild} from '../../interfaces/common/pc-build';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PcBuildService {




  /**
   * PC BUILD
   */

  pcBuildTools: PcBuild[] = [
    {
      _id: '1',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'CPU',
      slug: 'processor',
      componentIcon: '/assets/images/pc-build/cpu.png'
    },
    {
      _id: '2',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'CPU Cooler',
      slug: 'cpu-cooler',
      componentIcon: '/assets/images/pc-build/processor.png'
    },
    {
      _id: '3',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'Mother Board',
      slug: 'motherboard',
      componentIcon: '/assets/images/pc-build/processor.png'
    },
    {
      _id: '4',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'RAM - 1',
      slug: 'ram-(desktop)',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '5',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'RAM - 2',
      slug: 'ram-(desktop)',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '6',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'Storage (SSD)',
      slug: 'ssd',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '7',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'Storage (HDD)',
      slug: 'hard-disk-drive',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '8',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'Graphics Card',
      slug: 'graphics-card',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '9',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'Power Supply',
      slug: 'power-supply',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '10',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'Casing',
      slug: 'casing',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '11',
      tag: 'Component',
      productName: null,
      image: null,
      price: null,
      component: 'Casing Cooler',
      slug: 'casing-cooler',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '12',
      tag: 'monitor',
      productName: null,
      image: null,
      price: null,
      component: 'Monitor',
      slug: 'monitor',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '13',
      tag: 'accessories',
      productName: null,
      image: null,
      price: null,
      component: 'Keyboard',
      slug: 'keyboard',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '14',
      tag: 'accessories',
      productName: null,
      image: null,
      price: null,
      component: 'Mouse',
      slug: 'mouse',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '15',
      tag: 'accessories',
      productName: null,
      image: null,
      price: null,
      component: 'Headphone',
      slug: 'headphone',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '16',
      tag: 'software',
      productName: null,
      image: null,
      price: null,
      component: 'AntiVirus',
      slug: 'antivirus',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
    {
      _id: '17',
      tag: 'ups',
      productName: null,
      image: null,
      price: null,
      component: ' UPS',
      slug: 'ups',
      componentIcon: '/assets/images/pc-build/ram.png'
    },
  ];

  constructor() {
  }

  addProductToBuildTool(componentId: string, data: { name: string; price: number; image: string }) {
    const items = JSON.parse(sessionStorage.getItem('buildPC'));

    if (items === null) {
      const index = this.pcBuildTools.findIndex(i => i._id === componentId);
      this.pcBuildTools[index].productName = data.name;
      this.pcBuildTools[index].image = data.image;
      this.pcBuildTools[index].price = data.price;

      sessionStorage.setItem('buildPC', JSON.stringify(this.pcBuildTools));
    } else {
      const afterReplace = items.map(m => {
        if (m._id === componentId) {
          m.productName = data.name;
          m.price = data.price;
          m.image = data.image;
        }
        return m;
      });
      sessionStorage.setItem('buildPC', JSON.stringify(afterReplace));
    }

  }

  getProductToBuildTools(): PcBuild[] {
    const list = sessionStorage.getItem('buildPC');
    if (list === null) {
      return [...this.pcBuildTools];
    }
    return JSON.parse(list) as PcBuild[];
  }

  deleteProductToBuildToolsItem(componentId: string) {
    const list = JSON.parse(sessionStorage.getItem('buildPC')) as PcBuild[];
    const afterRemove = list.map(m => {
      if (m._id === componentId) {
        m.productName = null;
        m.price = null;
        m.image = null;
      }
      return m;
    })
    sessionStorage.setItem('buildPC', JSON.stringify(afterRemove));
  }


}
