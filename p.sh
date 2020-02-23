echo -e "Do someting："
echo -e "\033[31m 1.Bug \033[0m \033[36m 2.Update \033[0m \033[35m 3.Docs \033[0m"
read git
#read input
case $git in
    1)  echo -n 'Bug：'
        read input
        git add -A
        git commit -m "🐛$input"
        git push
    ;;
    2)  echo -n 'Update：'
        read input
        git add -A
        git commit -m "🛠$input"
        git push
    ;;
    3)  echo -n 'Docs：'
        read input
        git add -A
        git commit -m "📃$input"
        git push
    ;;
    *)  echo 'Maybe not today.'
    ;;
esac
# git add -A
# git commit -m "❤$input"
# git push
