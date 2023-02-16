import {MenuAdmin} from "../../interfaces/core/menu-admin";


export const menuItemsVendor: MenuAdmin[] = [

  // Parent Dashboard
  {
    id: '1',
    title: 'Dashboard',
    icon: 'dashboard',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  {
    id: 'v1id',
    title: 'Vendor Identification',
    icon: 'dashboard_customize',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'vendor-identification',
    href: null,
    target: null
  },
  // // Parent Customization
  // {
  //   id: '2',
  //   title: 'Customization',
  //   icon: 'dashboard_customize',
  //   hasSubMenu: true,
  //   parentId: null,
  //   routerLink: null,
  //   href: null,
  //   target: null
  // },
  // {
  //   id: 'a2',
  //   title: 'Carousel',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '2',
  //   routerLink: 'carousel',
  //   href: null,
  //   target: null
  // },
  // {
  //   id: 'a3',
  //   title: 'Shop Info',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '2',
  //   routerLink: 'shop-info',
  //   href: null,
  //   target: null
  // },
  // {
  //   id: 'a4',
  //   title: 'Order Timeline Info',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '2',
  //   routerLink: 'order-timeline-info',
  //   href: null,
  //   target: null
  // },
  // // Parent Products
  // {
  //   id: '3',
  //   title: 'Categories',
  //   icon: 'category',
  //   hasSubMenu: true,
  //   parentId: null,
  //   routerLink: null,
  //   href: null,
  //   target: null
  // },
  // {
  //   id: 'b1',
  //   title: 'Attributes',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '3',
  //   routerLink: 'attributes',
  //   href: null,
  //   target: null
  // },
  // {
  //   id: 'b10',
  //   title: 'Tags',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '3',
  //   routerLink: 'tags',
  //   href: null,
  //   target: null
  // },
  // {
  //   id: 'b2',
  //   title: 'Brands',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '3',
  //   routerLink: 'brands',
  //   href: null,
  //   target: null
  // },
  // {
  //   id: 'b3',
  //   title: 'Parent Category',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '3',
  //   routerLink: 'parent-category',
  //   href: null,
  //   target: null
  // },
  // {
  //   id: 'b4',
  //   title: 'Categories',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '3',
  //   routerLink: 'categories',
  //   href: null,
  //   target: null
  // },
  // {
  //   id: 'b5',
  //   title: 'Sub Categories',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '3',
  //   routerLink: 'sub-categories',
  //   href: null,
  //   target: null
  // },
  // Parent Products
  {
    id: '100',
    title: 'Products',
    icon: 'view_list',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null
  },
  {
    id: '100b1',
    title: 'Products List',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '100',
    routerLink: 'products',
    href: null,
    target: null
  },
  {
    id: '100b2',
    title: 'Add Product',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '100',
    routerLink: 'add-product',
    href: null,
    target: null
  },
  // Parent Gallery Folder
  {
    id: '45x',
    title: 'Image Folder',
    icon: 'folder',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'image-folder',
    href: null,
    target: null
  },
  // Parent Gallery
  {
    id: '4',
    title: 'Image Gallery',
    icon: 'collections',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'image-gallery',
    href: null,
    target: null
  },
  // Parent Additional Pages
  // {
  //   id: '45x',
  //   title: 'Shipping Charge',
  //   icon: 'attach_money',
  //   hasSubMenu: false,
  //   parentId: null,
  //   routerLink: 'shipping-charge',
  //   href: null,
  //   target: null
  // },
  // Parent Sales
  {
    id: '4',
    title: 'Sales',
    icon: 'local_mall',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null
  },
  {
    id: 'c1',
    title: 'Orders',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '4',
    routerLink: 'orders',
    href: null,
    target: null
  },
  {
    id: 'c1',
    title: 'Transactions',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '4',
    routerLink: 'transactions',
    href: null,
    target: null
  },
  {
    id: 'c1',
    title: 'Payments',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '4',
    routerLink: 'payments',
    href: null,
    target: null
  },
  // Parent Reviews
  {
    id: '9',
    title: 'Reviews',
    icon: 'reviews',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'reviews',
    href: null,
    target: null
  },
  // Parent Support
  {
    id: '10',
    title: 'Support',
    icon: 'support_agent',
    hasSubMenu: false,
    parentId: null,
    routerLink: null,
    href: 'https://softlabit.com/',
    target: '_blank'
  },

];
