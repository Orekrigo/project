import {createRouter, createWebHashHistory} from "vue-router";
import HomeView from "../views/frontViews/HomeView.vue";
import BookDetailView from "../views/frontViews/BookDetailView.vue";
import LoginView from "../views/frontViews/LoginView.vue";
import ContainerView from "../views/frontViews/ContainerView.vue";
import PersonalInfoView from "../views/frontViews/PersonalInfoView.vue";
import CommentLogView from "../views/frontViews/CommentLogView.vue";
import BackContainerView from "../views/backViews/BackContainerView.vue";
import BackLoginView from "../views/backViews/BackLoginView.vue";
import ClassificationView from "../views/frontViews/ClassificationView.vue";
import SearchView from "../views/frontViews/SearchView.vue";
import RecommendationView from "../views/frontViews/RecommendationView.vue";
import BorrowingRecordsView from "../views/frontViews/BorrowingRecordsView.vue";
import BorrowingRankView from "../views/frontViews/BorrowingRankView.vue";
import {reactive} from "vue";
import ClassDetailView from "../views/frontViews/ClassDetailView.vue";
import BackPersonView from "../views/backViews/BackPersonView.vue";


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/content',
            name: "content",
            component: ContainerView,
            // beforeEnter: (to, from, next) => {
            //
            // },
            children: [
                {
                    path: 'home',
                    name: "home",
                    component: HomeView
                },
                {
                    path: 'bookDetail/:id',
                    name: "bookDetail",
                    component: BookDetailView
                },
                {
                    path: 'person',
                    name: "person",
                    component: PersonalInfoView
                },
                {
                    path: 'comment',
                    name: "comment",
                    component: CommentLogView
                },
                {
                    path: 'classification',
                    name: "classification",
                    component: ClassificationView
                },
                {
                    path: 'search',
                    name: "search",
                    component: SearchView
                },
                {
                    path: 'recommendation',
                    name: "recommendation",
                    component: RecommendationView
                },
                {
                    path: 'borrowingRecords',
                    name: "borrowingRecords",
                    component: BorrowingRecordsView
                },
                {
                    path: 'borrowingRank',
                    name: "borrowingRank",
                    component: BorrowingRankView
                },
                {
                    path: 'classDetail',
                    name: "classDetail",
                    component: ClassDetailView
                }
            ]
        },
        {
            path: '/back',
            name: "back",
            component: BackContainerView,
            children: [
                {
                    path: 'backPerson',
                    name: "backPerson",
                    component: BackPersonView
                }
            ]
        },
        {
            path: '/backLogin',
            name: "backLogin",
            component: BackLoginView
        },
        {
            path: '/login',
            name: "login",
            component: LoginView,
        },
        {
            path: '/',
            redirect: '/login',
            name: "root"
        }
    ]
})
const contentAllName = reactive(["content", "home", "bookDetail", "person", "comment", "classification", "search", "recommendation", "borrowingRecords", "borrowingRank", "classDetail"])
const backAllName = reactive(["back", "backPerson"])
router.beforeEach((to, from, next) => {
    if (!sessionStorage.getItem('userID') && !sessionStorage.getItem('adminID') && (contentAllName.includes(to.name) || backAllName.includes(to.name))) {
        next(false)
    } else if (!sessionStorage.getItem('userID') && sessionStorage.getItem('adminID') && contentAllName.includes(to.name)) {
        next(false)
    } else if (sessionStorage.getItem('userID') && !sessionStorage.getItem('adminID') && backAllName.includes(to.name)) {
        next(false)
    } else {
        next()
    }
})

export default router