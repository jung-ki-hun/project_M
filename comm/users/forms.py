from django import forms 

from .models import User

class RegisterForm(forms.ModelForm):
    # 회원가입 폼
    # 장고에서는 HTML 입력요소를 widget(위젯)이라고 말한다. 
    password = forms.CharField(label='password', widget=forms.PasswordInput)
    confirm_password = forms.CharField(label='confirm password', widget=forms.PasswordInput)
    # 패스워드는 따로 관리, 클래스 변수로 사용
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'gender', 'email']
        # 필드를 이용해서 입력받은 필드 저장
    def clean_confirm_password(self):
        cd = self.cleaned_data
        if cd['password'] != cd['confirm_password']:
            raise forms.ValidationError('비밀번호가 일치하지 않습니다!')
        # cd는 cleand data의 약자
        return cd['confirm_password']
        # clean _confirmm_password 메소드는 유효성 확인시 사용.