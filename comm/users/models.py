from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
# Create your models here.
GENDER_CHOICES = (
    (0, '남자'),
    (1, '여자'),
)
class UserManager(BaseUserManager):
    def _create_user(self, email, username, password, gender=1, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(email=email, username=username, gender=gender, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    # '_" 가 있으면 클래스 내에서만 사용 하겠다.
    def create_user(self, email, username='', password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, username, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, 'blogs/like_section.html',  password, **extra_fields)



class User(AbstractUser):
    email = models.EmailField(verbose_name='email', max_length=255, unique=True)
    # unique 말 그대로 유니크한 값, 고유값으로 설정
    username = models.CharField(max_length=30)
    gender = models.SmallIntegerField(choices=GENDER_CHOICES)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] 
    # username_field는 기본적으로 username을 id로 사용하는데 
    # 이메일을 id로 사용할 것이기 떄문에 email을 적어준다.
    #  ^^ 필수로 받고 싶은 필드들 넣기 원래 소스 코드엔 email필드가 
    # 들어가지만 로그인을 이메일로 하니깐

    def __str__(self):
        return "<%d %s>" % (self.pk, self.email)