from django.shortcuts import render

from .forms import RegisterForm

def register(request):
    if request.method == 'POST': # 회원가입할떄 정보 기입할떄 POST 함.//서버로 데이터를 준다.
        user_form = RegisterForm(request.POST)
        if user_form.is_valid():  # 유효성 검사.
            user = user_form.save(commit=False)  # db save를 지연시켜 중복 지연
            user.set_password(user_form.cleaned_data['password'])
            user.save()
            return render(request, 'registration/login.html', {'user':user})
    else:
        user_form = RegisterForm()

    return render(request, 'registration/register.html', {'user_form':user_form})
