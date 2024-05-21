import heapq
import math

from django.db.models import Max

from .models import Comment, Book, User, Recommend


class Recommendation:

    def __init__(self):
        self.user_max_id = User.objects.aggregate(max_id=Max('id'))['max_id']
        self.book_max_id = Book.objects.aggregate(max_id=Max('id'))['max_id']
        self.initial_matrix = Comment.objects.values("userid", "bookid", "score")

    def get_matrix(self):
        user_array = [[0 for _ in range(self.book_max_id + 1)] for _ in range(self.user_max_id + 1)]
        for item in self.initial_matrix:
            user_array[item["userid"]][item["bookid"]] = float(item["score"])
        return user_array

    def get_similarity(self):
        user_array = self.get_matrix()
        similarity_matrix = [[0 for _ in range(self.user_max_id + 1)] for _ in range(self.user_max_id + 1)]
        for i in range(len(similarity_matrix)):
            for j in range(len(similarity_matrix[0])):
                similarity_matrix[i][j] = self.calculate_similarity(user_array[i], user_array[j])
        return similarity_matrix

    # K=3
    def k_nearest_neighbors(self):
        similarity_matrix = self.get_similarity()
        k_array = [0 for _ in range(self.user_max_id + 1)]
        indices = [0 for _ in range(self.user_max_id + 1)]
        for i in range(len(similarity_matrix)):
            for j in range(len(similarity_matrix[0])):
                k_array[j] = similarity_matrix[i][j]
            indices[i] = self.find_three_largest_indices(k_array)
        return indices

    @staticmethod
    def find_three_largest_indices(arr):
        largest_three = [(0, i) for i, _ in enumerate(arr[:3])]
        heapq.heapify(largest_three)
        for i, v in enumerate(arr[3:], 3):
            heapq.heappushpop(largest_three, (v, i))
        return [index for _, index in largest_three]

    @staticmethod
    def calculate_similarity(user1, user2):
        user_length = len(user1)
        sum1 = sum(user1)
        sum2 = sum(user2)
        average1 = sum1 / user_length
        average2 = sum2 / user_length
        top = 0
        bottom1 = 0
        bottom2 = 0
        for i in range(user_length):
            top += (user1[i] - average1) * (user2[i] - average2)
            bottom1 += math.pow(user1[i] - average1, 2)
            bottom2 += math.pow(user2[i] - average2, 2)
        bottom = math.sqrt(bottom1) * math.sqrt(bottom2)
        if bottom != 0:
            result = top / bottom
        else:
            result = 0
        return result

    @staticmethod
    def get_recommendation(userid):
        books = Comment.objects.filter(userid=userid).filter(score__gt=5).values_list('bookid', flat=True)
        return list(books)

    def result(self):
        res_user = self.k_nearest_neighbors()
        res_book = [0 for _ in range(len(res_user))]
        for i in range(len(res_user)):
            res_book[i] = []
            if res_user[i]:
                for j in range(3):
                    res1 = self.get_recommendation(res_user[i][j])
                    for k in range(len(res1)):
                        res_book[i].append(res1[k])
        Recommend.objects.all().delete()
        for i in range(1, len(res_book)):
            user_instance = User.objects.get(pk=i)
            Recommend.objects.create(userid=user_instance, bookid=res_book[i])
        print("recommendation done\n")
