import { Injectable } from "@angular/core";

export interface NavigationItem {
  id: string;
  title: string;
  type: "item" | "collapse" | "group";
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

@Injectable()
export class NavigationItem {
  get() {
    return [
      {
        id: "navigation",
        title: "Navigation",
        type: "group",
        icon: "icon-navigation",
        children: [
          {
            id: "dashboard",
            title: "Dashboard",
            type: "item",
            url: "/dashboard/default",
            icon: "feather icon-home",
            classes: "nav-item",
          },
          {
            id: "manage-users",
            title: "Manage users",
            type: "item",
            url: "/manage-users",
            icon: "fa fa-users",
            hidden: localStorage.getItem("role") == "webmaster" ? false : true,
            classes: "nav-item",
          },
          {
            id: "manage-configurations",
            title: "Manage configurations",
            type: "item",
            url: "/manage-configs",
            icon: "fa fa-cogs",
            hidden: localStorage.getItem("role") == "webmaster" ? false : true,
            classes: "nav-item",
          },
        ],
      },
    ];
  }
}
